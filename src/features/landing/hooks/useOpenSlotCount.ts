import { useWatch } from "react-hook-form";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { openSlotCount } from "@/features/landing/utils/openSlotCount";

/** `openSlotCount` for the wizard's window as it stands. */
export function useOpenSlotCount(): number {
  const [timezone, windowStart, days, dayStartHour, dayEndHour, votingClosesAt] =
    useWatch<CreateRoomInput>({
      name: ["timezone", "windowStart", "days", "dayStartHour", "dayEndHour", "votingClosesAt"],
    }) as [string, string, number, number, number, string];

  return openSlotCount({ timezone, windowStart, days, dayStartHour, dayEndHour, votingClosesAt });
}
