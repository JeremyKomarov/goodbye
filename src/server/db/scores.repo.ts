import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { GameId } from "@/core/constants/games.const";
import { asUser, db } from "./client";

// The games' scores: `public.scores`, one row per finished game, and the `public.leaderboard`
// view over it — each player's best per game, under their player name.

export interface BestScoreRecord {
  game: GameId;
  userId: string;
  displayName: string;
  score: number;
}

interface LeaderboardRow {
  game: GameId;
  user_id: string;
  display_name: string;
  score: number;
}

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

/** Every player's best score in every game of the room, unordered — the caller ranks them. */
export async function listBestScores(roomId: string): Promise<BestScoreRecord[]> {
  const { data, error } = await db()
    .from("leaderboard")
    .select("game, user_id, display_name, score")
    .eq("room_id", roomId)
    .overrideTypes<LeaderboardRow[], { merge: false }>();
  if (error) throw failed();
  return data.map((row) => ({
    game: row.game,
    userId: row.user_id,
    displayName: row.display_name,
    score: row.score,
  }));
}

// Row-level security said no: callers are checked to be players first, so the room has closed
// its games — the host has left.
const POLICY_VIOLATION = "42501";

/** Keeps a finished game's score, as the caller. */
export async function insertScore(
  accessToken: string,
  roomId: string,
  game: GameId,
  score: number,
): Promise<void> {
  const { error } = await asUser(accessToken)
    .from("scores")
    .insert({ room_id: roomId, game, score });
  if (error?.code === POLICY_VIOLATION) throw new ApiError(API_ERROR_CODES.games_closed, 409);
  if (error) throw failed();
}
