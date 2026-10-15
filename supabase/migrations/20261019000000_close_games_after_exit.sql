-- Once the host has left, the games close: the champions in the finale and in the
-- goodbye message are final. The wall stays open for late goodbyes.

drop policy "submit your score" on public.scores;
create policy "submit your score" on public.scores
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.rooms r
      where r.id = scores.room_id and r.status <> 'exited'
    )
  );
