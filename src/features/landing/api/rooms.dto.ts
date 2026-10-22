import { z } from "zod";

// The create-room contract. The input schema is the one the wizard's zodResolver and the Route
// Handler both use (03-DATA.md §4): it says which field is wrong, the strings layer says how.

export const HOST_GENDERS = { m: "m", f: "f" } as const;
export const LEAVE_REASONS = { fired: "fired", quit: "quit", fedUp: "fed_up" } as const;

export const MAX_HOST_NAME = 30;
export const MAX_GROUP_NAME = 60;
export const MAX_WINDOW_DAYS = 7;

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
    hostName: z.string().trim().min(1).max(MAX_HOST_NAME),
    hostGender: z.enum(HOST_GENDERS),
    groupName: z.string().trim().min(1).max(MAX_GROUP_NAME),
    reason: z.enum(LEAVE_REASONS).nullable(),
    timezone: z.string().refine(isTimeZone),
    windowStart: z.iso.date(),
    days: z.number().int().min(1).max(MAX_WINDOW_DAYS),
    dayStartHour: z.number().int().min(0).max(23),
    dayEndHour: z.number().int().min(1).max(24),
    votingClosesAt: z.iso.datetime({ offset: true }),
  })
  .refine((input) => input.dayEndHour > input.dayStartHour, { path: ["dayEndHour"] });

export type CreateRoomInput = z.input<typeof CreateRoomInputSchema>;

/** What the host gets back: the room's address, and the admin token shown to them once. */
export const CreatedRoomDtoSchema = z.object({
  slug: z.string(),
  admin_token: z.string(),
});

export type CreatedRoomDto = z.infer<typeof CreatedRoomDtoSchema>;
