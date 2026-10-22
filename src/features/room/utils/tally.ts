import type { Vote } from "@/features/room/types/room.types";

// Counting the votes. Ported from the original's core/slots.ts. The database decides the winner
// (compute_winner() in the migrations); this only shows who is leading on the way there.

/** Votes grouped by the slot they are for. */
export function tallyVotes(votes: Vote[]): Map<number, Vote[]> {
  const tally = new Map<number, Vote[]>();
  for (const vote of votes) {
    const list = tally.get(vote.slotMs);
    if (list) list.push(vote);
    else tally.set(vote.slotMs, [vote]);
  }
  return tally;
}

export interface Lead {
  ms: number;
  count: number;
  /** Every slot sharing the top count, earliest first. Voting closed on a tie draws one. */
  tied: number[];
}

/** The slot with the most votes, or null before anyone has voted. */
export function leadingSlot(tally: Map<number, Vote[]>): Lead | null {
  let count = 0;
  let tied: number[] = [];
  for (const [ms, list] of tally) {
    if (list.length > count) {
      count = list.length;
      tied = [ms];
    } else if (list.length === count) {
      tied.push(ms);
    }
  }
  if (count === 0) return null;
  tied.sort((a, b) => a - b);
  return { ms: tied[0], count, tied };
}

/** True when the locked hour was drawn at random from a tie. */
export function wonByDraw(lead: Lead | null, lockedSlot: number | null): boolean {
  return !!lead && lockedSlot !== null && lead.tied.length > 1 && lead.tied.includes(lockedSlot);
}
