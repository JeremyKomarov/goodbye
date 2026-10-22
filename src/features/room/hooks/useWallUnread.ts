import { useState } from "react";
import type { WallMessage } from "@/features/room/types/wall.types";

/**
 * Goodbyes posted since you last looked at the wall, not counting your own. What was on the wall
 * when the room opened counts as read; being on the wall reads everything.
 */
export function useWallUnread(
  messages: WallMessage[] | undefined,
  myUserId: string | undefined,
  isOnWall: boolean,
): number {
  const [seenUpTo, setSeenUpTo] = useState<number | null>(null);
  const newest = messages?.at(-1)?.id ?? 0;

  // Adjusted while rendering, not in an effect, so the badge never shows a stale count.
  if (messages && (seenUpTo === null || (isOnWall && seenUpTo !== newest))) setSeenUpTo(newest);

  if (!messages || isOnWall || seenUpTo === null) return 0;
  return messages.filter((message) => message.id > seenUpTo && message.userId !== myUserId).length;
}
