-- 1) Add the "picture" game ("מה בתמונה?") to scores. 2) Random tie-break for the winning hour.
-- The original checks were unnamed, so drop every check constraint on scores
-- and re-add them with explicit names.

do $$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.scores'::regclass and contype = 'c'
  loop
    execute format('alter table public.scores drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.scores
  add constraint scores_game_valid
    check (game in ('runaway', 'trivia', 'catch', 'picture')),
  -- Light anti-cheat: reject scores outside what the games can produce.
  add constraint scores_score_range check (
    (game = 'runaway' and score between 250 and 600000)
    or (game = 'trivia' and score between 0 and 1500)
    or (game = 'catch' and score between -1000 and 3000)
    or (game = 'picture' and score between 0 and 1500)
  );

-- Ties: most votes still wins, but a tie is now broken by a random draw among
-- the tied slots (it used to go to the earliest). With no votes, the first slot
-- after voting closes wins. finalize_room locks the room once, so the draw
-- happens exactly once.
create or replace function public.compute_winner(p_room uuid)
returns timestamptz
language plpgsql volatile
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

  with tally as (
    select v.slot_start, count(*) as c
    from public.votes v
    where v.room_id = p_room
    group by v.slot_start
  )
  select t.slot_start into w
  from tally t
  where t.c = (select max(c) from tally)
  order by random()
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

revoke execute on function public.compute_winner(uuid) from public, anon, authenticated;
