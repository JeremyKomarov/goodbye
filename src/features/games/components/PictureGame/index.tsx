"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { GAME_IDS } from "@/core/constants/games.const";
import { PictureStage } from "@/features/games/components/PictureStage";
import { PICTURE_POINTS, PICTURE_ROUND, TOP_SHOWN } from "@/features/games/content/pictures.const";
import { PICTURE_STATUSES, usePictureRound } from "@/features/games/hooks/usePictureRound";
import type { GameProps } from "@/features/games/types/games.types";
import { BUTTON_SIZES, BUTTON_VARIANTS, Button } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { useGameWords } from "@/shared/hooks/useGameWords";
import { cn } from "@/shared/utils/cn";
import { pictureGameClasses } from "./PictureGame.classes";
import { PICTURE_GAME_NAMESPACE, pictureGameKeys } from "./PictureGame.keys.const";

const MAX_GUESS = 40;

/**
 * "What's in the picture?": only the top shows, and it looks like one thing. Sometimes it is, and
 * sometimes the picture is something else. One guess, then the whole picture.
 */
export function PictureGame({ onFinish }: GameProps) {
  const t = useTranslations(PICTURE_GAME_NAMESPACE);
  const words = useGameWords();
  const round = usePictureRound(onFinish);
  const [guess, setGuess] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const { card, answer, status } = round;
  const isDone = status !== PICTURE_STATUSES.asking;

  // The guess box on each new picture; once it is revealed, Enter moves on.
  useEffect(() => {
    (isDone ? next : input).current?.focus({ preventScroll: true });
  }, [isDone, round.index, card]);

  if (!card || !answer)
    return (
      <div className={pictureGameClasses.intro}>
        <p className={pictureGameClasses.lead}>{t(pictureGameKeys.intro)}</p>
        <p className={pictureGameClasses.rules}>
          {t(pictureGameKeys.rules, { points: PICTURE_POINTS, count: PICTURE_ROUND })}
        </p>
        <Button size={BUTTON_SIZES.lg} onClick={round.start}>
          {t(pictureGameKeys.start)}
        </Button>
      </div>
    );

  const thing = t(pictureGameKeys.things[answer.thing]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    round.guess(guess);
  };
  const moveOn = () => {
    setGuess("");
    round.next();
  };

  return (
    <div className={pictureGameClasses.root}>
      <div className={pictureGameClasses.bar}>
        <span>{t(pictureGameKeys.progress, { number: round.index + 1, count: round.count })}</span>
        <span className={pictureGameClasses.score}>
          {words.score(GAME_IDS.picture, round.score)}
        </span>
      </div>
      <div className={pictureGameClasses.play}>
        <div className={pictureGameClasses.frame}>
          <div className={pictureGameClasses.picture}>
            <PictureStage
              key={card.puzzle.id}
              puzzle={card.puzzle}
              honest={card.honest}
              shown={isDone ? 100 : TOP_SHOWN}
              label={
                isDone
                  ? t(pictureGameKeys.stage.full, { thing })
                  : t(pictureGameKeys.stage.part, { shown: TOP_SHOWN })
              }
            />
          </div>
        </div>
        <div className={pictureGameClasses.panel}>
          {isDone ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p
                className={cn(pictureGameClasses.verdict, pictureGameClasses.tone[status])}
                aria-live="polite"
              >
                {status === PICTURE_STATUSES.right
                  ? t(pictureGameKeys.verdict.right, { points: PICTURE_POINTS })
                  : t(pictureGameKeys.verdict[status], { thing })}
              </p>
              <Button ref={next} fullWidth size={BUTTON_SIZES.lg} onClick={moveOn}>
                {t(round.isLast ? pictureGameKeys.finish : pictureGameKeys.next)}
              </Button>
            </motion.div>
          ) : (
            <form className={pictureGameClasses.form} onSubmit={submit}>
              <div className={pictureGameClasses.row}>
                <div className={pictureGameClasses.input}>
                  <Field
                    ref={input}
                    label={t(pictureGameKeys.guess.label)}
                    helper={t(pictureGameKeys.guess.helper, { points: PICTURE_POINTS })}
                    placeholder={t(pictureGameKeys.guess.placeholder)}
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    enterKeyHint="done"
                    maxLength={MAX_GUESS}
                  />
                </div>
                <Button type="submit" disabled={!guess.trim()}>
                  {t(pictureGameKeys.guess.submit)}
                </Button>
              </div>
              <Button type="button" variant={BUTTON_VARIANTS.ghost} onClick={round.skip}>
                {t(pictureGameKeys.guess.skip)}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
