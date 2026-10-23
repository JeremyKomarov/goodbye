import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { type GameId, LOWER_WINS } from "@/core/constants/games.const";
import { GAMES_NAMESPACE, gamesKeys } from "@/shared/strings/games.keys.const";

/**
 * A game's name and a score in words, in the reader's language: "תפוס את כפתור היציאה",
 * "2.41 שנ׳", "1,200 נק׳". Every game title and score on any screen is worded here.
 */
export function useGameWords() {
  const locale = useLocale();
  const t = useTranslations(GAMES_NAMESPACE);

  return useMemo(() => {
    const seconds = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return {
      title: (game: GameId) => t(gamesKeys.title[game]),
      score: (game: GameId, score: number) =>
        LOWER_WINS[game]
          ? t(gamesKeys.score.time, { seconds: seconds.format(score / 1000) })
          : t(gamesKeys.score.points, { points: score }),
    };
  }, [locale, t]);
}
