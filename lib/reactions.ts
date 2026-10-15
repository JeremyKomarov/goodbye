import type { WallMessage } from "@/lib/types";

/** The reactions a wall message can get, in picker order. Mirrors the check in SQL. */
export const REACTIONS = ["❤️", "😂", "😢", "🫡", "👏", "🔥"] as const;
export type ReactionEmoji = (typeof REACTIONS)[number];

export type WallReaction = {
  message_id: number;
  user_id: string;
  room_id: string;
  emoji: ReactionEmoji;
};

/** Message id → user id → that user's reaction. */
export type ReactionMap = Record<number, Record<string, ReactionEmoji>>;

export function isReaction(value: string): value is ReactionEmoji {
  return (REACTIONS as readonly string[]).includes(value);
}

/** One message's reactions as chips: most used first, then picker order. */
export function reactionCounts(
  byUser: Record<string, ReactionEmoji> | undefined,
) {
  const counts = new Map<ReactionEmoji, number>();
  for (const emoji of Object.values(byUser ?? {}))
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
  return REACTIONS.filter((emoji) => counts.has(emoji))
    .map((emoji) => ({ emoji, count: counts.get(emoji)! }))
    .sort((a, b) => b.count - a.count);
}

/** The message with the most reactions (the earliest one wins a tie), if any got one. */
export function mostLoved(messages: WallMessage[], reactions: ReactionMap) {
  let best: { message: WallMessage; count: number } | null = null;
  for (const message of messages) {
    const count = Object.keys(reactions[message.id] ?? {}).length;
    if (count > 0 && (!best || count > best.count)) best = { message, count };
  }
  return best;
}

/** `map` with one user's reaction to one message set (or removed, when undefined). */
export function withReaction(
  map: ReactionMap,
  messageId: number,
  userId: string,
  emoji: ReactionEmoji | undefined,
): ReactionMap {
  const current = map[messageId] ?? {};
  if (current[userId] === emoji) return map;
  const next = { ...current };
  if (emoji) next[userId] = emoji;
  else delete next[userId];
  return { ...map, [messageId]: next };
}
