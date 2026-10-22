import { useSyncExternalStore } from "react";
import { readSeen, subscribeSeen } from "@/features/room/utils/storiesSeen";

/** The ids of the story groups watched to the end in this browser; empty on the server. */
export function useSeenStories(): readonly string[] {
  const seen = useSyncExternalStore(subscribeSeen, readSeen, () => "");
  return seen.split(",").filter(Boolean);
}
