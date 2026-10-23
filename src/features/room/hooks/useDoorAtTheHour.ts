import { useEffect, useRef } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { THEME_EMOJI } from "@/features/room/components/EmojiRain/EmojiRain.const";
import type { Room } from "@/shared/types/room.types";
import { roomTheme } from "@/shared/utils/roomTheme";

/**
 * The chosen hour arrives: the theme's door (a door, a salute, a fire) rains on every screen that is open, and phones buzz. Each screen
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
  const door = THEME_EMOJI[roomTheme(room?.reason ?? null)].door;

  useEffect(() => {
    if (!isTicking) return;
    const before = wasTime.current;
    wasTime.current = isTime;
    if (before === false && isTime) {
      rain(door);
      navigator.vibrate?.([60, 80, 60]);
    }
  }, [isTicking, isTime, rain, door]);
}
