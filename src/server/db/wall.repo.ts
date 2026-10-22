import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { ReactionEmoji } from "@/core/constants/room.const";
import { asUser, db } from "./client";

// The farewell wall: `public.wall_messages` (the poster's name stamped by a trigger, one message
// per player per 3 seconds by policy) and `public.wall_reactions`, one per person per message.

/** The wall shows this many of the newest messages. */
export const WALL_LIMIT = 200;

export interface WallMessageRecord {
  id: number;
  userId: string;
  displayName: string;
  body: string;
  createdAt: string;
}

export interface WallReactionRecord {
  messageId: number;
  userId: string;
  emoji: ReactionEmoji;
}

interface MessageRow {
  id: number;
  user_id: string;
  display_name: string;
  body: string;
  created_at: string;
}

interface ReactionRow {
  message_id: number;
  user_id: string;
  emoji: ReactionEmoji;
}

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

/** The newest `WALL_LIMIT` messages, oldest first. */
export async function listWallMessages(roomId: string): Promise<WallMessageRecord[]> {
  const { data, error } = await db()
    .from("wall_messages")
    .select("id, user_id, display_name, body, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(WALL_LIMIT)
    .overrideTypes<MessageRow[], { merge: false }>();
  if (error) throw failed();
  return data.reverse().map((row) => ({
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function listWallReactions(roomId: string): Promise<WallReactionRecord[]> {
  const { data, error } = await db()
    .from("wall_reactions")
    .select("message_id, user_id, emoji")
    .eq("room_id", roomId)
    .overrideTypes<ReactionRow[], { merge: false }>();
  if (error) throw failed();
  return data.map((row) => ({ messageId: row.message_id, userId: row.user_id, emoji: row.emoji }));
}

// Row-level security said no. For a message: the caller posted less than 3 seconds ago (callers
// are checked to be players first). For a reaction: not a player, or not this room's message.
const POLICY_VIOLATION = "42501";

/** Posts as the caller. The database stamps their player name and spaces their messages out. */
export async function insertWallMessage(
  accessToken: string,
  roomId: string,
  body: string,
): Promise<WallMessageRecord> {
  const { data, error } = await asUser(accessToken)
    .from("wall_messages")
    // The name is required, and replaced by the poster's player name before the row is written.
    .insert({ room_id: roomId, body, display_name: "-" })
    .select("id, user_id, display_name, body, created_at")
    .single<MessageRow>();
  if (error?.code === POLICY_VIOLATION) throw new ApiError(API_ERROR_CODES.too_fast, 429);
  if (error || !data) throw failed();
  return {
    id: data.id,
    userId: data.user_id,
    displayName: data.display_name,
    body: data.body,
    createdAt: data.created_at,
  };
}

/** Reacts as the caller, or changes their reaction — one per person per message. */
export async function saveReaction(
  accessToken: string,
  reaction: WallReactionRecord & { roomId: string },
): Promise<void> {
  const { error } = await asUser(accessToken)
    .from("wall_reactions")
    .upsert(
      {
        message_id: reaction.messageId,
        room_id: reaction.roomId,
        user_id: reaction.userId,
        emoji: reaction.emoji,
      },
      { onConflict: "message_id,user_id" },
    );
  if (error?.code === POLICY_VIOLATION) throw new ApiError(API_ERROR_CODES.forbidden, 403);
  if (error) throw failed();
}

/** Takes the caller's reaction back. Nothing to take back is not an error. */
export async function removeReaction(accessToken: string, messageId: number, userId: string) {
  const { error } = await asUser(accessToken)
    .from("wall_reactions")
    .delete()
    .eq("message_id", messageId)
    .eq("user_id", userId);
  if (error) throw failed();
}
