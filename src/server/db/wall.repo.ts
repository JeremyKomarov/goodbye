import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { ReactionEmoji } from "@/core/constants/room.const";
import { db } from "./client";

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
