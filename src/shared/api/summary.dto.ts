import { z } from "zod";

// What the room adds up to, as GET /api/rooms/[slug]/summary sends it: the finale shows it, and
// the host's messages to the group tell it, from the room and from the admin page alike.
export const LovedMessageDtoSchema = z.object({
  display_name: z.string(),
  body: z.string(),
  reactions: z.number().int().positive(),
});

export const ExitSummaryDtoSchema = z.object({
  voter_count: z.number().int().nonnegative(),
  message_count: z.number().int().nonnegative(),
  /** The goodbye with the most reactions; the earliest of a tie. Null while none has one. */
  loved: LovedMessageDtoSchema.nullable(),
  /** The locked hour was drawn from a tie. */
  drawn: z.boolean(),
  /** The hour alone in the lead, while none is locked — what the host left during. */
  leading_slot: z.string().nullable(),
});

export type ExitSummaryDto = z.infer<typeof ExitSummaryDtoSchema>;
