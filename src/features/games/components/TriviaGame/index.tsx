"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GAME_IDS } from "@/core/constants/games.const";
import {
  ANSWERS, type OptionId, TRIVIA_ROUND, TRIVIA_SECONDS,
} from "@/features/games/content/trivia.const";
import { useTriviaRound } from "@/features/games/hooks/useTriviaRound";
import { TRIVIA_NAMESPACE, triviaKeys } from "@/features/games/strings/trivia.keys.const";
import type { GameProps } from "@/features/games/types/games.types";
import { BUTTON_SIZES, Button } from "@/shared/components/Button";
import { Ticks } from "@/shared/components/Ticks";
import { useGameWords } from "@/shared/hooks/useGameWords";
import { useNow } from "@/shared/hooks/useNow";
import { cn } from "@/shared/utils/cn";
import { triviaGameClasses } from "./TriviaGame.classes";
import { TRIVIA_GAME_NAMESPACE, triviaGameKeys } from "./TriviaGame.keys.const";

// The clock turns red for the last seconds.
const HURRY_MS = 5000;

/** Ten questions, fifteen seconds each; a right answer is worth more the quicker it came. */
export function TriviaGame({ onFinish }: GameProps) {
  const t = useTranslations(TRIVIA_GAME_NAMESPACE);
  const tq = useTranslations(TRIVIA_NAMESPACE);
  const words = useGameWords();
  const round = useTriviaRound(onFinish);
  const now = useNow();
  const { question, picked, gained } = round;

  if (!question)
    return (
      <div className={triviaGameClasses.intro}>
        <p className={triviaGameClasses.lead}>
          {t(triviaGameKeys.intro, { count: TRIVIA_ROUND, seconds: TRIVIA_SECONDS })}
        </p>
        <Button size={BUTTON_SIZES.lg} onClick={round.start}>
          {t(triviaGameKeys.start)}
        </Button>
      </div>
    );

  const keys = triviaKeys[question.id];
  const isAnswered = picked !== undefined;
  const left = isAnswered || !now ? 0 : Math.max(0, round.deadline - now);
  const tone = (option: OptionId) =>
    !isAnswered
      ? triviaGameClasses.tone.idle
      : option === ANSWERS[question.id]
        ? triviaGameClasses.tone.right
        : option === picked
          ? triviaGameClasses.tone.wrong
          : triviaGameClasses.tone.dim;

  return (
    <div className={triviaGameClasses.root}>
      <div className={triviaGameClasses.bar}>
        <span>{t(triviaGameKeys.progress, { number: round.index + 1, count: TRIVIA_ROUND })}</span>
        <span className={triviaGameClasses.score}>{words.score(GAME_IDS.trivia, round.score)}</span>
      </div>
      <div className={triviaGameClasses.clock} title={t(triviaGameKeys.timeLeft)} aria-hidden>
        <motion.div
          className={cn(triviaGameClasses.fill, left < HURRY_MS && triviaGameClasses.hurry)}
          animate={{ width: `${(left / (TRIVIA_SECONDS * 1000)) * 100}%` }}
          transition={{ ease: "linear", duration: 0.25 }}
        />
      </div>
      <div className={triviaGameClasses.body}>
        <AnimatePresence mode="wait">
          <motion.div
            key={round.index}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className={triviaGameClasses.question}>{tq(keys.q)}</h3>
            <div className={triviaGameClasses.options}>
              {question.options.map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  disabled={isAnswered}
                  className={cn(triviaGameClasses.option, tone(option))}
                  onClick={() => round.answer(option)}
                  animate={
                    isAnswered && option === picked && option !== ANSWERS[question.id]
                      ? { x: [0, -8, 8, -5, 5, 0] }
                      : undefined
                  }
                >
                  <span>{tq(keys[option])}</span>
                  {isAnswered && option === ANSWERS[question.id] && <Ticks />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {isAnswered && (
        <motion.div
          className={triviaGameClasses.verdict}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
        >
          <div>
            <p className={triviaGameClasses.said}>
              {picked === null
                ? t(triviaGameKeys.verdict.timeout)
                : gained > 0
                  ? t(triviaGameKeys.verdict.right, { points: gained })
                  : t(triviaGameKeys.verdict.wrong)}
            </p>
            <p className={triviaGameClasses.fact}>{tq(keys.fact)}</p>
          </div>
          <Button fullWidth size={BUTTON_SIZES.lg} onClick={round.next}>
            {t(round.isLast ? triviaGameKeys.finish : triviaGameKeys.next)}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
