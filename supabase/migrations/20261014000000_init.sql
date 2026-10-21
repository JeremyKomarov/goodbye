-- Exit-the-group voting party: rooms, players, votes, game scores, farewell wall.
-- Participants use Supabase anonymous auth (role `authenticated`); room creation and
-- host actions go through Next.js server actions with the secret key.

create type public.room_status as enum ('voting', 'locked', 'exited');

-- Rooms -----------------------------------------------------------------------

create table public.rooms (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[A-Za-z0-9_-]{6,16}$'),
  host_name        text not null check (char_length(host_name) between 1 and 30),
  host_gender      text not null default 'm' check (host_gender in ('m', 'f')),
  group_name       text not null check (char_length(group_name) between 1 and 60),
  reason           text check (reason in ('fired', 'quit', 'fed_up')),
  timezone         text not null default 'Asia/Jerusalem',
  window_start     date not null,
  window_end       date not null,
  day_start_hour   smallint not null check (day_start_hour between 0 and 23),
  day_end_hour     smallint not null check (day_end_hour between 1 and 24),
  voting_closes_at timestamptz not null,
  status           public.room_status not null default 'voting',
  locked_slot      timestamptz,
  exited_at        timestamptz,
  created_at       timestamptz not null default now(),
  check (window_end >= window_start and window_end - window_start <= 6),
  check (day_end_hour > day_start_hour)
);

-- Admin token hashes live apart from rooms so they are never exposed to clients.
create table public.room_secrets (
  room_id          uuid primary key references public.rooms (id) on delete cascade,
  admin_token_hash text not null
);

-- Players, votes, scores, wall ---------------------------------------------------

create table public.players (
  room_id      uuid not null references public.rooms (id) on delete cascade,
  user_id      uuid not null default auth.uid(),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 24),
  created_at   timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table public.votes (
  id         bigint generated always as identity primary key,
  room_id    uuid not null references public.rooms (id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  slot_start timestamptz not null,
  updated_at timestamptz not null default now(),
  unique (room_id, user_id)
);
create index votes_room_idx on public.votes (room_id);

create table public.scores (
  id         bigint generated always as identity primary key,
  room_id    uuid not null references public.rooms (id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  game       text not null check (game in ('runaway', 'trivia', 'catch')),
  score      integer not null,
  created_at timestamptz not null default now(),
  -- Light anti-cheat: reject scores outside what the games can produce.
  check (
    (game = 'runaway' and score between 250 and 600000)
    or (game = 'trivia' and score between 0 and 1500)
    or (game = 'catch' and score between -1000 and 3000)
  )
);
create index scores_room_game_idx on public.scores (room_id, game);

create table public.wall_messages (
  id           bigint generated always as identity primary key,
  room_id      uuid not null references public.rooms (id) on delete cascade,
  user_id      uuid not null default auth.uid(),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 24),
  body         text not null check (char_length(btrim(body)) between 1 and 140),
  created_at   timestamptz not null default now()
);
create index wall_messages_room_idx on public.wall_messages (room_id, created_at);

-- Best score per player per game ("runaway" is a time, so lower wins).
create view public.leaderboard with (security_invoker = true) as
select distinct on (s.room_id, s.game, s.user_id)
  s.room_id, s.game, s.user_id, s.score, s.created_at, p.display_name
from public.scores s
join public.players p on p.room_id = s.room_id and p.user_id = s.user_id
order by s.room_id, s.game, s.user_id,
  case when s.game = 'runaway' then s.score else -s.score end,
  s.created_at;

-- Slot rules -------------------------------------------------------------------

-- A slot is votable when the room is open, it starts on the hour (room timezone),
-- falls inside the date window and daily hours, and is not before voting closes.
create function public.can_vote(p_room uuid, p_slot timestamptz)
returns boolean
language sql stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.rooms r
    where r.id = p_room
      and r.status = 'voting'
      and now() < r.voting_closes_at
      and p_slot >= r.voting_closes_at
      and (p_slot at time zone r.timezone)::date between r.window_start and r.window_end
      and date_trunc('hour', p_slot at time zone r.timezone) = (p_slot at time zone r.timezone)
      and extract(hour from p_slot at time zone r.timezone) >= r.day_start_hour
      and extract(hour from p_slot at time zone r.timezone) < r.day_end_hour
  );
$$;

-- Most votes wins; ties go to the earliest slot. With no votes, the first slot
-- after voting closes wins.
create function public.compute_winner(p_room uuid)
returns timestamptz
language plpgsql stable
set search_path = ''
as $$
declare
  r public.rooms;
  w timestamptz;
begin
  select * into r from public.rooms where id = p_room;
  if not found then
    return null;
  end if;

  select v.slot_start into w
  from public.votes v
  where v.room_id = p_room
  group by v.slot_start
  order by count(*) desc, v.slot_start asc
  limit 1;

  if w is null then
    select s into w
    from generate_series(
      (r.window_start::timestamp + make_interval(hours => r.day_start_hour)) at time zone r.timezone,
      (r.window_end::timestamp + make_interval(hours => r.day_end_hour - 1)) at time zone r.timezone,
      interval '1 hour'
    ) as s
    where s >= r.voting_closes_at
      and extract(hour from s at time zone r.timezone) >= r.day_start_hour
      and extract(hour from s at time zone r.timezone) < r.day_end_hour
    order by s
    limit 1;
  end if;

  return w;
end;
$$;

-- Anyone may call this once voting time is over; it is idempotent.
create function public.finalize_room(p_slug text)
returns public.rooms
language plpgsql security definer
set search_path = ''
as $$
declare
  r public.rooms;
begin
  select * into r from public.rooms where slug = p_slug for update;
  if not found then
    return null;
  end if;

  if r.status = 'voting' and now() >= r.voting_closes_at then
    update public.rooms
    set status = 'locked', locked_slot = public.compute_winner(r.id)
    where id = r.id
    returning * into r;
  end if;

  return r;
end;
$$;

-- Host-only: lock immediately (called by the server with the secret key).
create function public.admin_lock_room(p_room uuid)
returns public.rooms
language plpgsql security definer
set search_path = ''
as $$
declare
  r public.rooms;
begin
  update public.rooms
  set status = 'locked',
      locked_slot = public.compute_winner(p_room),
      voting_closes_at = least(voting_closes_at, now())
  where id = p_room and status = 'voting'
  returning * into r;

  if not found then
    select * into r from public.rooms where id = p_room;
  end if;

  return r;
end;
$$;

revoke execute on function public.compute_winner(uuid) from public, anon, authenticated;
revoke execute on function public.admin_lock_room(uuid) from public, anon, authenticated;
grant execute on function public.finalize_room(text) to anon, authenticated;
grant execute on function public.can_vote(uuid, timestamptz) to anon, authenticated;

-- Row level security -----------------------------------------------------------

alter table public.rooms enable row level security;
alter table public.room_secrets enable row level security;
alter table public.players enable row level security;
alter table public.votes enable row level security;
alter table public.scores enable row level security;
alter table public.wall_messages enable row level security;

revoke all on public.room_secrets from anon, authenticated;

create policy "rooms are public" on public.rooms
  for select to anon, authenticated using (true);

create policy "players are public" on public.players
  for select to anon, authenticated using (true);
create policy "join as yourself" on public.players
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "rename yourself" on public.players
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "votes are public" on public.votes
  for select to anon, authenticated using (true);
create policy "cast your vote" on public.votes
  for insert to authenticated
  with check (user_id = (select auth.uid()) and public.can_vote(room_id, slot_start));
create policy "change your vote" on public.votes
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and public.can_vote(room_id, slot_start));
create policy "withdraw your vote" on public.votes
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.rooms r
      where r.id = room_id and r.status = 'voting' and now() < r.voting_closes_at
    )
  );

create policy "scores are public" on public.scores
  for select to anon, authenticated using (true);
create policy "submit your score" on public.scores
  for insert to authenticated with check (user_id = (select auth.uid()));

create policy "wall is public" on public.wall_messages
  for select to anon, authenticated using (true);
create policy "post on the wall" on public.wall_messages
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and not exists (
      select 1 from public.wall_messages w
      where w.room_id = wall_messages.room_id
        and w.user_id = (select auth.uid())
        and w.created_at > now() - interval '3 seconds'
    )
  );

grant select on public.leaderboard to anon, authenticated;

-- Realtime -----------------------------------------------------------------------

alter publication supabase_realtime
  add table public.rooms, public.players, public.votes, public.scores, public.wall_messages;
