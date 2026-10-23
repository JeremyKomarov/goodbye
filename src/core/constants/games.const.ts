// The room's games. The ids are the database's (supabase/migrations/…_picture_game_and_ties.sql):
// its check rejects any other game, and any score outside the game's range.

export const GAME_IDS = {
  runaway: "runaway",
  trivia: "trivia",
  catch: "catch",
  picture: "picture",
} as const;

export type GameId = (typeof GAME_IDS)[keyof typeof GAME_IDS];

/** In the hub's order. */
export const GAME_ORDER: readonly GameId[] = [
  GAME_IDS.runaway,
  GAME_IDS.trivia,
  GAME_IDS.catch,
  GAME_IDS.picture,
];

/** What a game can score, as the database checks it. Runaway's is a time in milliseconds. */
export const SCORE_RANGES: Record<GameId, { min: number; max: number }> = {
  runaway: { min: 250, max: 600_000 },
  trivia: { min: 0, max: 1500 },
  catch: { min: -1000, max: 3000 },
  picture: { min: 0, max: 1500 },
};

/** Runaway is timed: the lower score wins. Every other game counts points. */
export const LOWER_WINS: Record<GameId, boolean> = {
  runaway: true,
  trivia: false,
  catch: false,
  picture: false,
};
