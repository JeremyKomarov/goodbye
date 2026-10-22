import { z } from "zod";

// A vote is the start of an hour slot. PUT /api/rooms/[slug]/vote casts or moves the caller's;
// DELETE takes it back. Which hours count is the room's window (shared/utils/slots.ts) and,
// on the database's side, can_vote().
export const CastVoteInputSchema = z.object({
  slotStart: z.iso.datetime({ offset: true }),
});

export type CastVoteInput = z.input<typeof CastVoteInputSchema>;
