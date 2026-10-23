import { GAME_ORDER, type GameId, LOWER_WINS } from "@/core/constants/games.const";
import type { GameRecord } from "@/shared/types/records.types";

/** Whether `score` beats `than` in this game. */
export function beats(game: GameId, score: number, than: number): boolean {
  return LOWER_WINS[game] ? score < than : score > than;
}

/** One game's records, best first. */
export function rankRecords(records: readonly GameRecord[], game: GameId): GameRecord[] {
  const sign = LOWER_WINS[game] ? 1 : -1;
  return records.filter((r) => r.game === game).sort((a, b) => sign * (a.score - b.score));
}

/** The record holder of each game that has one, in the hub's order. */
export function champions(records: readonly GameRecord[]): GameRecord[] {
  return GAME_ORDER.flatMap((game) => rankRecords(records, game).slice(0, 1));
}

/**
 * Where a new score puts this player: their best after it, whether it beat their previous best,
 * and their place among everyone with a score.
 */
export function placeOf(
  records: readonly GameRecord[],
  game: GameId,
  userId: string,
  score: number,
) {
  const previous = records.find((r) => r.game === game && r.userId === userId)?.score;
  const isBest = previous === undefined || beats(game, score, previous);
  const best = isBest ? score : previous;
  const others = rankRecords(records, game).filter((r) => r.userId !== userId);
  const rank = others.filter((r) => beats(game, r.score, best)).length + 1;
  return { isBest, rank, total: others.length + 1 };
}
