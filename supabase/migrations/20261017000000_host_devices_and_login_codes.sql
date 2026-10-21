-- 1) A host on a second device (opened the admin link there) joins under the host's
--    name too: two host users may share it. Everyone else still needs a free name.
-- 2) Players who made a code for another device have an email login behind their
--    user (<id>@players.invalid), so they're no longer "anonymous". The nightly
--    cleanup now removes those users too, once they're in no room.

create or replace function public.check_player_name()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  joining_host boolean := exists (
    select 1 from public.room_hosts h
    where h.room_id = new.room_id and h.user_id = new.user_id
  );
begin
  if exists (
    select 1 from public.players p
    where p.room_id = new.room_id
      and p.user_id <> new.user_id
      and public.norm_name(p.display_name) = public.norm_name(new.display_name)
      and not (
        joining_host
        and exists (
          select 1 from public.room_hosts h
          where h.room_id = new.room_id and h.user_id = p.user_id
        )
      )
  ) then
    raise exception 'name_taken' using errcode = '23505';
  end if;

  if not joining_host and exists (
    select 1 from public.rooms r
    where r.id = new.room_id
      and public.norm_name(r.host_name) = public.norm_name(new.display_name)
  ) then
    raise exception 'name_taken' using errcode = '23505';
  end if;

  return new;
end;
$$;

-- Same job name: this replaces the schedule from the previous migration.
select cron.schedule(
  'cleanup-old-rooms',
  '17 3 * * *',
  $$
    delete from public.rooms
    where (status = 'exited' and exited_at < now() - interval '30 days')
       or created_at < now() - interval '60 days';

    delete from auth.users u
    where (u.is_anonymous or u.email like '%@players.invalid')
      and u.created_at < now() - interval '30 days'
      and not exists (select 1 from public.players p where p.user_id = u.id);
  $$
);
