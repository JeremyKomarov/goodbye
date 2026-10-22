import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";

/** The wizard's steps, in order, and the fields each must pass before the next. */
export const FORM_STEPS = [
  { key: "reason", fields: ["reason"] },
  { key: "who", fields: ["hostName", "groupName", "hostGender"] },
  {
    key: "when",
    fields: ["windowStart", "days", "dayStartHour", "dayEndHour", "votingClosesAt"],
  },
] as const satisfies readonly { key: string; fields: readonly (keyof CreateRoomInput)[] }[];

export type FormStepKey = (typeof FORM_STEPS)[number]["key"];

/** The window a new room starts with: two days, 09:00–22:00, voting closing in three hours. */
export const DEFAULT_DAYS = 2;
export const DEFAULT_DAY_START_HOUR = 9;
export const DEFAULT_DAY_END_HOUR = 22;
export const DEFAULT_CLOSE_AFTER_HOURS = 3;
