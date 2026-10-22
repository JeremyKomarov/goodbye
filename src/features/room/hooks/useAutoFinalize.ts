import { useEffect } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import type { Room } from "@/features/room/types/room.types";
import { useFinalizeRoom } from "./useFinalizeRoom";

// A clock running ahead of the database's asks too early and gets the room back unlocked.
const RETRY_MS = 4000;

/** Once this screen's clock passes the close, asks for the result until the room has locked. */
export function useAutoFinalize(room: Room | undefined, now: number) {
  const { mutateAsync: finalize } = useFinalizeRoom(room?.slug ?? "");
  const isOver =
    room?.status === ROOM_STATUSES.voting && now > 0 && now >= room.votingClosesAt;

  useEffect(() => {
    if (!isOver) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const attempt = async () => {
      const result = await finalize().catch(() => null);
      if (!cancelled && (!result || result.status === ROOM_STATUSES.voting))
        timer = setTimeout(attempt, RETRY_MS);
    };
    void attempt();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOver, finalize]);
}
