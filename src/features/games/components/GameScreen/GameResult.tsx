"use client";

import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { GameId } from "@/core/constants/games.const";
import { BUTTON_SIZES, Button } from "@/shared/components/Button";
import { useGameWords } from "@/shared/hooks/useGameWords";
import { gameScreenClasses } from "./GameScreen.classes";
import { GAME_SCREEN_NAMESPACE, gameScreenKeys } from "./GameScreen.keys.const";

export interface Result {
  score: number;
  isBest: boolean;
  rank: number;
  total: number;
}

interface GameResultProps {
  game: GameId;
  result: Result;
  /** Why the score wasn't kept, once the server has said. */
  error: Error | null;
  /** The host has left: no more rounds. */
  isClosed: boolean;
  hubHref: Route;
  onAgain: () => void;
}

/** The round's score, and where it puts you in the room. */
export function GameResult(props: GameResultProps) {
  const { game, result, error, isClosed, hubHref, onAgain } = props;
  const t = useTranslations(GAME_SCREEN_NAMESPACE);
  const words = useGameWords();
  const isRefused = error instanceof ApiError && error.code === API_ERROR_CODES.games_closed;
  const verdict =
    result.isBest && result.rank === 1
      ? gameScreenKeys.result.roomRecord
      : result.isBest
        ? gameScreenKeys.result.personalBest
        : gameScreenKeys.result.yours;

  return (
    <motion.section
      className={gameScreenClasses.result}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      aria-live="polite"
    >
      <p className={gameScreenClasses.verdict}>{t(verdict)}</p>
      <p className={gameScreenClasses.score}>{words.score(game, result.score)}</p>
      <p className={gameScreenClasses.place}>
        {result.total === 1
          ? t(gameScreenKeys.result.first)
          : t(gameScreenKeys.result.place, { rank: result.rank, total: result.total })}
      </p>
      {error && (
        <p className={gameScreenClasses.error} role="alert">
          {t(isRefused ? gameScreenKeys.result.closed : gameScreenKeys.result.failed)}
        </p>
      )}
      <div className={gameScreenClasses.actions}>
        {!isClosed && !isRefused && (
          <Button fullWidth size={BUTTON_SIZES.lg} onClick={onAgain}>
            {t(gameScreenKeys.result.again)}
          </Button>
        )}
        <Link href={hubHref} className={gameScreenClasses.all}>
          {t(gameScreenKeys.result.all)}
        </Link>
      </div>
    </motion.section>
  );
}
