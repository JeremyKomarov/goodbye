import type { GameId } from "@/core/constants/games.const";

/** A player's best score in one game of the room — the room's leaderboard is a list of these. */
export interface GameRecord {
  game: GameId;
  userId: string;
  name: string;
  score: number;
}
