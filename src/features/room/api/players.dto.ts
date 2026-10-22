import { z } from "zod";

// Joining a room and naming yourself in it. One input for both: PUT /api/rooms/[slug]/me makes the
// caller's player row or renames it. The database allows 1–24 characters once trimmed.

export const MAX_PLAYER_NAME = 24;

export const SaveNameInputSchema = z.object({
  name: z.string().trim().min(1).max(MAX_PLAYER_NAME),
});

/** The host's claim: their admin token makes this browser's user one of the room's hosts. */
export const ClaimHostInputSchema = z.object({
  adminToken: z.string().min(1),
});

export type SaveNameInput = z.input<typeof SaveNameInputSchema>;
export type ClaimHostInput = z.input<typeof ClaimHostInputSchema>;
