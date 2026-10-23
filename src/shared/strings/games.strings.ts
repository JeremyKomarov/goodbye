// The games' names and their scores in words — the hub, a game's screen, the room's board and the
// finale alike. Read by shared/hooks/useGameWords.ts.
export const gamesStrings = {
  title: {
    runaway: "תפוס את כפתור היציאה",
    trivia: "טריוויה של קבוצות",
    catch: "99+ הודעות",
    picture: "מה בתמונה?",
  },
  // `seconds` arrives formatted, two decimals.
  score: {
    time: "{seconds} שנ׳",
    points: "{points, number} נק׳",
  },
};
