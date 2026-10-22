import type { voteHeatmapKeys } from "./VoteHeatmap.keys.const";

/** What went wrong with a vote, as the strings name it. */
export type VoteErrorCode = keyof typeof voteHeatmapKeys.errors;

/** The hours the grid marks: this browser's vote, the winner, and the one to keep in view. */
export interface SlotMarks {
  mine: number | null;
  winner: number | null;
  /** Your vote, else the winner. */
  anchor: number | null;
}

export interface VotingState {
  closesAt: number;
  /** Voting has not closed yet. */
  isOpen: boolean;
  /** Voting is open and this browser may vote — joined, and not the host. */
  canCast: boolean;
}
