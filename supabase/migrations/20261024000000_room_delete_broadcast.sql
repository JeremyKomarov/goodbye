-- A deleted row reaches Realtime with its key alone, so a deletion can't be filtered by room: every
-- open room heard every withdrawn vote, taken-back reaction and deleted goodbye, and re-read.
-- Instead each such deletion is broadcast on its own room's channel, `room:<id>`, which is public
-- (as the tables' select policies are). The broadcast names the table and nothing else.

create or replace function public.broadcast_room_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('table', tg_table_name),
    'deleted',
    'room:' || old.room_id::text,
    false
  );
  return old;
end;
$$;

revoke all on function public.broadcast_room_delete() from public, anon, authenticated;

create trigger votes_broadcast_delete
  after delete on public.votes
  for each row execute function public.broadcast_room_delete();

create trigger wall_messages_broadcast_delete
  after delete on public.wall_messages
  for each row execute function public.broadcast_room_delete();

create trigger wall_reactions_broadcast_delete
  after delete on public.wall_reactions
  for each row execute function public.broadcast_room_delete();
