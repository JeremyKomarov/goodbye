import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { asUser, db } from "./client";

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

/** Whether the user has joined the room. */
export async function isPlayer(roomId: string, userId: string): Promise<boolean> {
  const { count, error } = await db()
    .from("players")
    .select("user_id", { count: "exact", head: true })
    .eq("room_id", roomId)
    .eq("user_id", userId);
  if (error) throw failed();
  return (count ?? 0) > 0;
}

const UNIQUE_VIOLATION = "23505";

/**
 * Joins the room under `name`, or renames the caller if they already have. Written as the caller,
 * so the database checks it is their own row and that the name is free (`name_taken`, 409).
 */
export async function savePlayerName(
  accessToken: string,
  roomId: string,
  userId: string,
  name: string,
): Promise<PlayerRecord> {
  const { data, error } = await asUser(accessToken)
    .from("players")
    .upsert(
      { room_id: roomId, user_id: userId, display_name: name },
      { onConflict: "room_id,user_id" },
    )
    .select("user_id, display_name")
    .single<PlayerRow>();
  if (error?.code === UNIQUE_VIOLATION) throw new ApiError(API_ERROR_CODES.name_taken, 409, "name");
  if (error || !data) throw failed();
  return { userId: data.user_id, displayName: data.display_name };
}
