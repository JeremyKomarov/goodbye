// Before a run that writes (`npm run e2e`, `npm run test:db`): deletes the test rooms an earlier
// run left behind when it was killed before its own clean-up — every one is "… — delete me" — and
// the anonymous users who were only in them. A room under an hour old may be a run in progress, so
// it stays. Without the secret key nothing was written, and nothing is swept.
import { createClient } from "@supabase/supabase-js";

const TEST_ROOM = "%— delete me";
const HOUR_MS = 3_600_000;

export default async function sweepTestRooms() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key || process.env.E2E_NO_DATABASE) return;
  const db = createClient(url, key, { auth: { persistSession: false } });

  const { data: rooms, error } = await db
    .from("rooms")
    .select("id")
    .like("group_name", TEST_ROOM)
    .lt("created_at", new Date(Date.now() - HOUR_MS).toISOString());
  if (error) throw new Error(`sweep: ${error.message}`);
  if (!rooms.length) return;
  const ids = rooms.map((room) => room.id as string);

  const { data: players } = await db.from("players").select("user_id").in("room_id", ids);
  await db.from("rooms").delete().in("id", ids);
  for (const userId of new Set((players ?? []).map((p) => p.user_id as string))) {
    const { count } = await db
      .from("players")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (count === 0) await db.auth.admin.deleteUser(userId);
  }
  console.log(`sweep: ${ids.length} leftover test room(s) deleted`);
}
