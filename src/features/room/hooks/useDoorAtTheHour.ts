import { useEffect, useRef } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { DOOR_EMOJI } from "@/features/room/components/EmojiRain/EmojiRain.const";
import type { Room } from "@/shared/types/room.types";

/**
 * The chosen hour arrives: a door rains on every screen that is open, and phones buzz. Each screen
 * has the clock, so nothing is broadcast. Only the moment of arrival counts — not a page opened
 * after it.
 */
export function useDoorAtTheHour(
  room: Room | undefined,
  now: number,
  rain: (emoji: string) => void,
) {
  const isTime =
    room?.status === ROOM_STATUSES.locked && room.lockedSlot !== null && now >= room.lockedSlot;
  const wasTime = useRef<boolean | null>(null);
  const isTicking = now > 0;

  useEffect(() => {
    if (!isTicking) return;
    const before = wasTime.current;
    wasTime.current = isTime;
    if (before === false && isTime) {
      rain(DOOR_EMOJI);
      navigator.vibrate?.([60, 80, 60]);
    }
  }, [isTicking, isTime, rain]);
}
