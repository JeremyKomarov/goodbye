import type { Room } from "@/shared/types/room.types";

// How the host's exit compares with the hour the group chose. Ported from the original's
// core/room-view.ts; the sentence for each kind is the hero's strings.

/** Within this many minutes of the voted hour counts as on time. */
export const ON_TIME_MINUTES = 10;

export const VERDICT_KINDS = {
  onTime: "on_time",
  late: "late",
  early: "early",
  // Left while the group was still voting, so there was no hour to be early or late for.
  midVote: "mid_vote",
} as const;

export type Verdict =
  | { kind: typeof VERDICT_KINDS.onTime | typeof VERDICT_KINDS.late | typeof VERDICT_KINDS.early;
      diffMs: number }
  | { kind: typeof VERDICT_KINDS.midVote };

/** Null until the host has left. */
export function verdict(room: Pick<Room, "exitedAt" | "lockedSlot">): Verdict | null {
  if (room.exitedAt === null) return null;
  if (room.lockedSlot === null) return { kind: VERDICT_KINDS.midVote };
  const diffMs = room.exitedAt - room.lockedSlot;
  if (Math.abs(diffMs) <= ON_TIME_MINUTES * 60_000) return { kind: VERDICT_KINDS.onTime, diffMs };
  return { kind: diffMs > 0 ? VERDICT_KINDS.late : VERDICT_KINDS.early, diffMs };
}
