-- The write routes' rate limit (docs/DECISIONS.md #15): a count per key per fixed window, taken
-- and judged in one statement so two requests at once can't both slip under. Only the server
-- calls it, with the secret key; clients can neither read the counts nor take a hit.

create table public.rate_limits (
  key          text not null,
  window_start timestamptz not null,
  hits         integer not null default 1,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- Takes one hit on `p_key` in the current window of `p_window_seconds`, and answers whether the
-- key is still within `p_max` hits for that window.
create or replace function public.hit_rate_limit(p_key text, p_window_seconds integer, p_max integer)
returns boolean
language sql
security definer
set search_path = ''
as $$
  insert into public.rate_limits as r (key, window_start)
  values (
    p_key,
    to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds)
  )
  on conflict (key, window_start) do update set hits = r.hits + 1
  returning hits <= p_max;
$$;

revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;

-- Every night, the windows that have passed. No budget is longer than a day.
select cron.schedule(
  'cleanup-rate-limits',
  '27 3 * * *',
  $$ delete from public.rate_limits where window_start < now() - interval '1 day'; $$
);
