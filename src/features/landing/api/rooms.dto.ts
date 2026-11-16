import { z } from "zod";
import {
  HOST_GENDERS, LEAVE_REASONS, type HostGender, type LeaveReason,
} from "@/core/constants/room.const";
import { LOCALES } from "@/core/i18n/routing";

// The create-room contract. The input schema is the one the wizard's zodResolver and the Route
// Handler both use (03-DATA.md §4): it says which field is wrong, the strings layer says how.

// The enums are the room screen's too, so they live in core/constants and are re-exported here.
export { HOST_GENDERS, LEAVE_REASONS, type HostGender, type LeaveReason };

// Counted in characters, as the database's `char_length` counts them — not in UTF-16 units, where
// an emoji is two and a name with one would be refused before the limit.
export const MAX_HOST_NAME = 30;
export const MAX_GROUP_NAME = 60;
export const MAX_WINDOW_DAYS = 7;

/** The characters in `value` — code points, as Postgres's `char_length` counts them. */
export function charCount(value: string) {
  return [...value].length;
}

/** A name: trimmed, at least one character, at most `max` of them. */
const nameSchema = (max: number) =>
  z.string().trim().min(1).refine((value) => charCount(value) <= max);

function isTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const CreateRoomInputSchema = z
  .object({
    hostName: nameSchema(MAX_HOST_NAME),
    hostGender: z.enum(HOST_GENDERS),
    groupName: nameSchema(MAX_GROUP_NAME),
    reason: z.enum(LEAVE_REASONS).nullable(),
    timezone: z.string().refine(isTimeZone),
    windowStart: z.iso.date(),
    days: z.number().int().min(1).max(MAX_WINDOW_DAYS),
    dayStartHour: z.number().int().min(0).max(23),
    dayEndHour: z.number().int().min(1).max(24),
    votingClosesAt: z.iso.datetime({ offset: true }),
    /** The language the host created the room in — the whole room's, for everyone. */
    locale: z.enum(LOCALES),
  })
  .refine((input) => input.dayEndHour > input.dayStartHour, { path: ["dayEndHour"] });

export type CreateRoomInput = z.input<typeof CreateRoomInputSchema>;

/** What the host gets back: the room's address, and the admin token shown to them once. */
export const CreatedRoomDtoSchema = z.object({
  slug: z.string(),
  admin_token: z.string(),
});

export type CreatedRoomDto = z.infer<typeof CreatedRoomDtoSchema>;
