import { useWatch } from "react-hook-form";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { addDaysToDate, allSlots } from "@/shared/utils/slots";

/**
 * How many hours the group could vote on with the wizard's window as it stands: only hours after
 * voting closes count. 0 while the window is incomplete or backwards.
 */
export function useOpenSlotCount(): number {
  const [timezone, windowStart, days, dayStartHour, dayEndHour, votingClosesAt] =
    useWatch<CreateRoomInput>({
      name: ["timezone", "windowStart", "days", "dayStartHour", "dayEndHour", "votingClosesAt"],
    }) as [string, string, number, number, number, string];

  const closesAtMs = Date.parse(votingClosesAt);
  if (!windowStart || Number.isNaN(closesAtMs) || dayEndHour <= dayStartHour) return 0;

  const window = {
    timezone,
    windowStart,
    windowEnd: addDaysToDate(windowStart, days - 1),
    dayStartHour,
    dayEndHour,
  };
  return allSlots(window).filter((slot) => slot.ms >= closesAtMs).length;
}
