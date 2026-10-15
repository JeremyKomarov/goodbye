-- 1) Hosts: which anonymous users are the room's host (one per device they use).
--    Hosts don't vote, and their wall messages get a badge.
-- 2) Names: unique per room, the host's name is reserved for the host, and wall
--    messages always carry the poster's real player name.
-- 3) Reactions on wall messages.
-- 4) A nightly cleanup of finished rooms and stale anonymous users.
-- Everything here is backward compatible with the previous client.

-- Hosts ------------------------------------------------------------------------

create table public.room_hosts (
  room_id    uuid not null references public.rooms (id) on delete cascade,
  user_id    uuid not null,
  created_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

alter table public.room_hosts enable row level security;
create policy "hosts are public" on public.room_hosts
  for select to anon, authenticated using (true);
-- Rows are written only by the server (secret key) after it checks the admin token.

-- Names ------------------------------------------------------------------------

-- "  Dana   Levi " and "dana levi" are the same name.
create function public.norm_name(p_name text)
returns text
language sql immutable
set search_path = ''
as $$
  select lower(regexp_replace(btrim(p_name), '\s+', ' ', 'g'));
$$;

create function public.check_player_name()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.players p
    where p.room_id = new.room_id
      and p.user_id <> new.user_id
      and public.norm_name(p.display_name) = public.norm_name(new.display_name)
  ) then
    raise exception 'name_taken' using errcode = '23505';
  end if;

  if exists (
    select 1 from public.rooms r
    where r.id = new.room_id
      and public.norm_name(r.host_name) = public.norm_name(new.display_name)
  ) and not exists (
    select 1 from public.room_hosts h
    where h.room_id = new.room_id and h.user_id = new.user_id
  ) then
    raise exception 'name_taken' using errcode = '23505';
  end if;

  return new;
end;
$$;

create trigger players_check_name
  before insert or update of display_name on public.players
  for each row execute function public.check_player_name();

-- The wall shows the poster's player name, whatever the client sent.
create function public.stamp_wall_name()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select p.display_name into new.display_name
  from public.players p
  where p.room_id = new.room_id and p.user_id = new.user_id;
  if not found then
    raise exception 'not_a_player' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger wall_messages_stamp_name
  before insert on public.wall_messages
  for each row execute function public.stamp_wall_name();

-- Votes: only players who aren't the host --------------------------------------

create function public.is_voter(p_room uuid)
returns boolean
language sql stable
set search_path = ''
as $$
  select exists (
      select 1 from public.players p
      where p.room_id = p_room and p.user_id = (select auth.uid())
    )
    and not exists (
      select 1 from public.room_hosts h
      where h.room_id = p_room and h.user_id = (select auth.uid())
    );
$$;

grant execute on function public.is_voter(uuid) to authenticated;

drop policy "cast your vote" on public.votes;
create policy "cast your vote" on public.votes
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and public.can_vote(room_id, slot_start)
    and public.is_voter(room_id)
  );

drop policy "change your vote" on public.votes;
create policy "change your vote" on public.votes
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and public.can_vote(room_id, slot_start)
    and public.is_voter(room_id)
  );

-- Reactions --------------------------------------------------------------------

create table public.wall_reactions (
  message_id bigint not null references public.wall_messages (id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  room_id    uuid not null references public.rooms (id) on delete cascade,
  emoji      text not null check (emoji in ('❤️', '😂', '😢', '🫡', '👏', '🔥')),
  created_at timestamptz not null default now(),
  -- One reaction per person per message, like WhatsApp.
  primary key (message_id, user_id)
);
create index wall_reactions_room_idx on public.wall_reactions (room_id);

alter table public.wall_reactions enable row level security;

create policy "reactions are public" on public.wall_reactions
  for select to anon, authenticated using (true);
create policy "react as yourself" on public.wall_reactions
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.wall_messages w
      where w.id = wall_reactions.message_id and w.room_id = wall_reactions.room_id
    )
    and exists (
      select 1 from public.players p
      where p.room_id = wall_reactions.room_id and p.user_id = (select auth.uid())
    )
  );
create policy "change your reaction" on public.wall_reactions
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.wall_messages w
      where w.id = wall_reactions.message_id and w.room_id = wall_reactions.room_id
    )
  );
create policy "remove your reaction" on public.wall_reactions
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- Realtime ---------------------------------------------------------------------

alter publication supabase_realtime add table public.room_hosts, public.wall_reactions;

-- Cleanup ----------------------------------------------------------------------

-- Every night: rooms 30 days after the exit (or 60 days after creation if the host
-- never pressed exit) go, with everything in them. Then anonymous users older than
-- 30 days who are no longer in any room.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'cleanup-old-rooms',
  '17 3 * * *',
  $$
    delete from public.rooms
    where (status = 'exited' and exited_at < now() - interval '30 days')
       or created_at < now() - interval '60 days';

    delete from auth.users u
    where u.is_anonymous
      and u.created_at < now() - interval '30 days'
      and not exists (select 1 from public.players p where p.user_id = u.id);
  $$
);
