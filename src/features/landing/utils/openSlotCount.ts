import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { addDaysToDate, allSlots } from "@/shared/utils/slots";

export type WindowFields = Pick<
  CreateRoomInput,
  "timezone" | "windowStart" | "days" | "dayStartHour" | "dayEndHour" | "votingClosesAt"
>;

/**
 * How many hours the group could vote on in this window: only hours after voting closes count.
 * 0 while the window is incomplete or backwards.
 */
export function openSlotCount(form: WindowFields): number {
  const { timezone, windowStart, days, dayStartHour, dayEndHour, votingClosesAt } = form;
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
