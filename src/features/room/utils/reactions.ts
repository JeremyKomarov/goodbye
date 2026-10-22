import { REACTION_EMOJIS, type ReactionEmoji } from "@/core/constants/room.const";
import type { ReactionMap } from "@/features/room/types/wall.types";

// Reactions on the wall. Ported from the original's core/reactions.ts.

export interface ReactionCount {
  emoji: ReactionEmoji;
  count: number;
}

/** One message's reactions as chips: most used first, then in picker order. */
export function reactionCounts(byUser: Record<string, ReactionEmoji> | undefined): ReactionCount[] {
  const counts = new Map<ReactionEmoji, number>();
  for (const emoji of Object.values(byUser ?? {})) counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
  return REACTION_EMOJIS.filter((emoji) => counts.has(emoji))
    .map((emoji) => ({ emoji, count: counts.get(emoji) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}

/** `map` with one person's reaction to one message set, or removed when `emoji` is null. */
export function withReaction(
  map: ReactionMap,
  messageId: number,
  userId: string,
  emoji: ReactionEmoji | null,
): ReactionMap {
  const current = map[messageId] ?? {};
  if ((current[userId] ?? null) === emoji) return map;
  const next = { ...current };
  if (emoji) next[userId] = emoji;
  else delete next[userId];
  return { ...map, [messageId]: next };
}
