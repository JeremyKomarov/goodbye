import { useState, useSyncExternalStore } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { loadFinaleSeen, saveFinaleSeen } from "@/features/room/utils/finaleSeen";
import type { Room } from "@/shared/types/room.types";

const noSubscription = () => () => {};

export interface Finale {
  isOpen: boolean;
  replay: () => void;
  close: () => void;
}

/**
 * The finale plays by itself once per exit on each browser, as soon as the visitor is in the room;
 * after that, the exit card replays it.
 */
export function useFinale(room: Room | undefined, isInRoom: boolean): Finale {
  const slug = room?.slug ?? "";
  const exitedAt = room?.status === ROOM_STATUSES.exited ? room.exitedAt : null;
  const seenAt = useSyncExternalStore(noSubscription, () => loadFinaleSeen(slug), () => null);
  const [closedFor, setClosedFor] = useState<number | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const isSeen = closedFor === exitedAt || seenAt === String(exitedAt);

  return {
    isOpen: exitedAt !== null && isInRoom && (isReplaying || !isSeen),
    replay: () => setIsReplaying(true),
    close: () => {
      setIsReplaying(false);
      setClosedFor(exitedAt);
      if (exitedAt !== null) saveFinaleSeen(slug, exitedAt);
    },
  };
}
