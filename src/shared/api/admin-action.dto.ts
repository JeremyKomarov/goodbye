import { z } from "zod";

// What the host can do to their room: PATCH /api/rooms/[slug]/admin, with the admin token. The
// admin page sends every action; the room sends `exit`, from the red row under the countdown.

export const ADMIN_ACTIONS = {
  /** Close the vote now; the leading hour wins. */
  lock: "lock",
  /** Open the vote again — or move its close — until `votingClosesAt`. */
  reopen: "reopen",
  /** "I left the group." Before the close, a mid-vote exit; a second press keeps the first time. */
  exit: "exit",
  /** Back to the countdown, or to the vote if the exit came before an hour was chosen. */
  undoExit: "undo_exit",
} as const;

export const AdminActionInputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal(ADMIN_ACTIONS.lock) }),
  z.object({
    action: z.literal(ADMIN_ACTIONS.reopen),
    votingClosesAt: z.iso.datetime({ offset: true }),
  }),
  z.object({ action: z.literal(ADMIN_ACTIONS.exit) }),
  z.object({ action: z.literal(ADMIN_ACTIONS.undoExit) }),
]);

export type AdminActionInput = z.input<typeof AdminActionInputSchema>;
