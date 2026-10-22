import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { db } from "./client";

// The people in a room: `public.players`, one row per anonymous user who joined. A name is unique
// in its room, and the host's name is theirs alone — the check_player_name() trigger enforces both.

export interface PlayerRecord {
  userId: string;
  displayName: string;
}

interface PlayerRow {
  user_id: string;
  display_name: string;
}

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

/** Everyone who has joined the room, oldest first. */
export async function listPlayers(roomId: string): Promise<PlayerRecord[]> {
  const { data, error } = await db()
    .from("players")
    .select("user_id, display_name")
    .eq("room_id", roomId)
    .order("created_at")
    .overrideTypes<PlayerRow[], { merge: false }>();
  if (error) throw failed();
  return data.map((row) => ({ userId: row.user_id, displayName: row.display_name }));
}
