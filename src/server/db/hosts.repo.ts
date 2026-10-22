import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { db } from "./client";

// Which users are the room's host: `public.room_hosts`, one row per device the host has opened the
// room on. Hosts don't vote. Only the server writes here, after it checks the admin token.

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

/** The host's user ids — one per device they have opened the room on. */
export async function listHostIds(roomId: string): Promise<string[]> {
  const { data, error } = await db()
    .from("room_hosts")
    .select("user_id")
    .eq("room_id", roomId)
    .overrideTypes<{ user_id: string }[], { merge: false }>();
  if (error) throw failed();
  return data.map((row) => row.user_id);
}

/** Records `userId` as one of the room's host devices. Idempotent: a second claim changes nothing. */
export async function addHost(roomId: string, userId: string): Promise<void> {
  const { error } = await db()
    .from("room_hosts")
    .upsert(
      { room_id: roomId, user_id: userId },
      { onConflict: "room_id,user_id", ignoreDuplicates: true },
    );
  if (error) throw failed();
}
