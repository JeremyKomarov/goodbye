import type { GameId, LeaderboardRow } from "@/lib/types";

export const GAME_META: Record<
  GameId,
  { title: string; lowerWins: boolean; format: (score: number) => string }
> = {
  runaway: {
    title: "תפוס את כפתור היציאה",
    lowerWins: true,
    format: (s) => `${(s / 1000).toFixed(2)} שנ׳`,
  },
  trivia: {
    title: "טריוויה של קבוצות",
    lowerWins: false,
    format: (s) => `${s.toLocaleString("he-IL")} נק׳`,
  },
  catch: {
    title: "99+ הודעות",
    lowerWins: false,
    format: (s) => `${s.toLocaleString("he-IL")} נק׳`,
  },
  picture: {
    title: "מה בתמונה?",
    lowerWins: false,
    format: (s) => `${s.toLocaleString("he-IL")} נק׳`,
  },
};

export function rankRows(rows: LeaderboardRow[], game: GameId) {
  const lower = GAME_META[game].lowerWins;
  return rows
    .filter((r) => r.game === game)
    .sort((a, b) => (lower ? a.score - b.score : b.score - a.score));
}

/** The record holder of each game that has one. */
export function champions(rows: LeaderboardRow[]) {
  return (Object.keys(GAME_META) as GameId[]).flatMap((game) => {
    const top = rankRows(rows, game)[0];
    return top ? [{ game, top }] : [];
  });
}
