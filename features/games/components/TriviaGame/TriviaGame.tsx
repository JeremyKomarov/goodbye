"use client";

import styles from "./TriviaGame.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Ticks } from "@/components/ui/Ticks/Ticks";
import { TRIVIA } from "@/core/content/trivia";
import { useNow } from "@/core/hooks/useNow";

// Read the clock outside render-analyzed code; only called from handlers and timers.
const clockNow = () => Date.now();

const ROUND = 10;
const SECONDS = 15;

type Question = { q: string; options: string[]; answer: number; fact: string };

function shuffle<T>(list: T[]) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(): Question[] {
  return shuffle(TRIVIA)
    .slice(0, ROUND)
    .map((t) => {
      const order = shuffle([0, 1, 2, 3]);
      return {
        q: t.q,
        fact: t.fact,
        options: order.map((i) => t.options[i]),
        answer: order.indexOf(t.answer),
      };
    });
}

export function TriviaGame({
  onFinish,
}: {
  onFinish: (score: number) => void;
}) {
  const [round, setRound] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null | undefined>(undefined); // undefined = unanswered, null = timed out
  const [deadline, setDeadline] = useState(0);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = useNow();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function ask(i: number) {
    setIndex(i);
    setPicked(undefined);
    setGained(0);
    const end = clockNow() + SECONDS * 1000;
    setDeadline(end);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => answer(null, end), SECONDS * 1000);
  }

  function start() {
    setRound(buildRound());
    setScore(0);
    ask(0);
  }

  function answer(choice: number | null, end = deadline) {
    if (timer.current) clearTimeout(timer.current);
    setPicked((current) => (current === undefined ? choice : current));
    if (choice === null || !round) return;
    const correct = choice === round[index].answer;
    const left = Math.max(0, end - clockNow());
    const points = correct
      ? 100 + Math.round((50 * left) / (SECONDS * 1000))
      : 0;
    navigator.vibrate?.(correct ? 12 : [30, 40, 30]);
    setGained(points);
    setScore((s) => s + points);
  }

  if (!round) {
    return (
      <div className={styles.view1}>
        <p className={styles.view2}>
          {ROUND} שאלות על וואטסאפ, חיי משרד ואנשים שפוטרו והצליחו. {SECONDS}{" "}
          שניות לכל שאלה, ותשובה מהירה שווה יותר.
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={start}
          className={styles.view3}
        >
          התחלה
        </motion.button>
      </div>
    );
  }

  const q = round[index];
  const answered = picked !== undefined;
  const left = answered || !now ? 0 : Math.max(0, deadline - now);
  const last = index === ROUND - 1;

  return (
    <div className={styles.view4}>
      <div className={styles.view5}>
        <span>
          שאלה {index + 1} מתוך {ROUND}
        </span>
        <span className={styles.view6}>{score} נק׳</span>
      </div>
      <div className={styles.view7}>
        <motion.div
          className={[styles.view8, left < 5000 ? styles.view9 : styles.view10, ""].filter(Boolean).join(" ")}
          animate={{
            width: `${answered ? 0 : (left / (SECONDS * 1000)) * 100}%`,
          }}
          transition={{ ease: "linear", duration: 0.25 }}
        />
      </div>

      {/* Question and options scroll if they must; the verdict and "next" stay pinned below. */}
      <div className={styles.view11}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className={styles.view12}>
            {q.q}
          </h3>
          <div className={styles.view13}>
            {q.options.map((option, i) => {
              const isAnswer = i === q.answer;
              const isPicked = i === picked;
              const tone = !answered
                ? styles.answerIdle
                : isAnswer
                  ? styles.answerCorrect
                  : isPicked
                    ? styles.answerWrong
                    : styles.answerDimmed;
              return (
                <motion.button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => answer(i)}
                  whileTap={answered ? undefined : { scale: 0.98 }}
                  animate={
                    answered && isPicked && !isAnswer
                      ? { x: [0, -8, 8, -5, 5, 0] }
                      : undefined
                  }
                  className={[styles.view14, tone, ""].filter(Boolean).join(" ")}
                >
                  <span>{option}</span>
                  {answered && isAnswer && <Ticks />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.view15}
        >
          <div className={styles.view16}>
          <p className={styles.view17}>
            {picked === null
              ? "נגמר הזמן"
              : gained > 0
                ? `נכון! +${gained}`
                : "לא הפעם"}
          </p>
          <p className={styles.view18}>{q.fact}</p>
          </div>
          <button
            type="button"
            onClick={() => (last ? onFinish(score) : ask(index + 1))}
            className={styles.view19}
          >
            {last ? "לתוצאה" : "לשאלה הבאה"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
