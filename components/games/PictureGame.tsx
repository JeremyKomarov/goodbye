"use client";

import { motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PictureStage } from "@/components/games/PictureStage";
import { letterHint, matches } from "@/lib/answers";
import { PICTURES, type PicturePuzzle } from "@/lib/content/pictures";
import { useNow } from "@/lib/hooks/useNow";

// Read the clock outside render-analyzed code; only called from handlers and timers.
const clockNow = () => Date.now();

const ROUND = 6;
const SECONDS = 20;
const POINTS = {
  decoy: { base: 50, bonus: 25 },
  truth: { base: 100, bonus: 50 },
} as const;

type Stage = "decoy" | "truth";
type Status = "asking" | "correct" | "missed";

function shuffle<T>(list: T[]) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * "מה בתמונה?": guess what the top quarter of a picture shows, then the rest opens and you guess
 * what the whole picture really is.
 */
export function PictureGame({
  onFinish,
}: {
  onFinish: (score: number) => void;
}) {
  const [round, setRound] = useState<PicturePuzzle[] | null>(null);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("decoy");
  const [status, setStatus] = useState<Status>("asking");
  const [deadline, setDeadline] = useState(0);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState(0);
  const [guess, setGuess] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputScope, animateInput] = useAnimate();
  const now = useNow();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (advance.current) clearTimeout(advance.current);
    },
    [],
  );

  function ask(i: number, s: Stage) {
    setIndex(i);
    setStage(s);
    setStatus("asking");
    setGuess("");
    setGained(0);
    setDeadline(clockNow() + SECONDS * 1000);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => endStage(i, s, "missed", 0),
      SECONDS * 1000,
    );
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    );
  }

  function endStage(i: number, s: Stage, outcome: Status, points: number) {
    if (timer.current) clearTimeout(timer.current);
    setStatus(outcome);
    setGained(points);
    if (points) setScore((v) => v + points);
    if (outcome === "missed") navigator.vibrate?.([30, 40, 30]);
    // After the top quarter, open the full picture on its own; after the twist, wait for "next".
    if (s === "decoy")
      advance.current = setTimeout(
        () => ask(i, "truth"),
        outcome === "correct" ? 900 : 1700,
      );
  }

  function start() {
    const picked = shuffle(PICTURES).slice(0, ROUND);
    // Warm the cache so covers flip onto fully drawn scenes.
    for (const icon of new Set(
      picked.flatMap((p) => [...p.top, ...p.bottom].flatMap((l) => ("icon" in l ? [l.icon] : []))),
    )) {
      new window.Image().src = `/picture-game/${icon}.svg`;
    }
    setRound(picked);
    setScore(0);
    ask(0, "decoy");
  }

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!round || status !== "asking" || !guess.trim()) return;
    const puzzle = round[index];
    const answers =
      stage === "decoy" ? puzzle.decoy.answers : puzzle.truth.answers;
    if (matches(guess, answers)) {
      const left = Math.max(0, deadline - clockNow());
      const { base, bonus } = POINTS[stage];
      navigator.vibrate?.(12);
      endStage(
        index,
        stage,
        "correct",
        base + Math.round((bonus * left) / (SECONDS * 1000)),
      );
    } else {
      navigator.vibrate?.([20, 30, 20]);
      animateInput(
        inputScope.current,
        { x: [0, -10, 10, -6, 6, 0] },
        { duration: 0.4 },
      );
      inputRef.current?.select();
    }
  }

  function next() {
    if (!round) return;
    if (index + 1 < round.length) ask(index + 1, "decoy");
    else onFinish(score);
  }

  if (!round) {
    return (
      <div className="my-auto rounded-3xl bg-panel/90 p-6 text-center">
        <p className="mb-2 text-lg text-ink/85">
          רואים רבע תמונה ובטוחים שזה ברור. כותבים מה זה, ואז נפתחת התמונה המלאה
          ומתברר שזה משהו אחר לגמרי.
        </p>
        <p className="mb-5 text-sm text-mute">
          {ROUND} תמונות, {SECONDS} שניות לכל ניחוש. ניחוש מהיר שווה יותר.
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={start}
          className="rounded-2xl bg-pill px-8 py-4 text-lg font-semibold text-night"
        >
          התחלה
        </motion.button>
      </div>
    );
  }

  const puzzle = round[index];
  const target = stage === "decoy" ? puzzle.decoy : puzzle.truth;
  const left = status === "asking" && now ? Math.max(0, deadline - now) : 0;
  const showHint =
    status === "asking" && now > 0 && left < (SECONDS * 1000) / 2;
  const done = stage === "truth" && status !== "asking";
  const last = index === round.length - 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between text-sm text-mute">
        <span>
          תמונה {index + 1} מתוך {round.length}
        </span>
        <span className="tabular-nums">{score} נק׳</span>
      </div>
      <div className="mb-3 h-1.5 shrink-0 overflow-hidden rounded-full bg-raised">
        <motion.div
          className={`h-full rounded-full ${left < 5000 ? "bg-exit" : "bg-pill"}`}
          animate={{ width: `${(left / (SECONDS * 1000)) * 100}%` }}
          transition={{ ease: "linear", duration: 0.25 }}
        />
      </div>

      {/* The picture takes whatever room is left, staying square. */}
      <div
        className="relative min-h-0 flex-1"
        style={{ containerType: "size" }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <PictureStage
            key={puzzle.id}
            puzzle={puzzle}
            revealed={stage === "truth"}
            className="w-[min(100cqw,100cqh)]"
          />
        </div>
      </div>

      <div className="shrink-0 pt-3">
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-panel/90 p-4"
          >
            <p
              className={`text-sm font-semibold ${status === "correct" ? "text-signal" : "text-exit"}`}
            >
              {status === "correct"
                ? `✓ נכון! +${gained}`
                : `זה היה ${puzzle.truth.label}`}
            </p>
            <p className="mt-1 text-lg font-semibold leading-snug">
              {puzzle.reveal}
            </p>
            <button
              type="button"
              onClick={next}
              className="mt-3 w-full rounded-2xl bg-pill py-3.5 font-semibold text-night"
            >
              {last ? "לתוצאה" : "לתמונה הבאה"}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={submit}>
            <label
              htmlFor="picture-guess"
              className="mb-1.5 block font-semibold"
            >
              {stage === "decoy" ? "מה רואים ברבע הזה?" : "ומה זה באמת?"}
            </label>
            <div ref={inputScope} className="flex gap-2">
              <input
                ref={inputRef}
                id="picture-guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                disabled={status !== "asking"}
                placeholder="כתבו כאן"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="done"
                maxLength={40}
                className="min-w-0 flex-1 rounded-2xl bg-raised px-4 py-3 text-lg outline-none placeholder:text-mute/70 focus:ring-2 focus:ring-pill/70 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status !== "asking" || !guess.trim()}
                className="shrink-0 rounded-2xl bg-pill px-5 font-semibold text-night disabled:opacity-40"
              >
                בדיקה
              </button>
            </div>
            <div
              className="mt-2 flex h-6 items-center justify-between text-sm"
              aria-live="polite"
            >
              {status === "correct" ? (
                <span className="font-semibold text-signal">
                  ✓ נכון! +{gained}
                </span>
              ) : status === "missed" ? (
                <span className="text-exit">זה היה {target.label}</span>
              ) : showHint ? (
                <span className="text-mute">
                  רמז:{" "}
                  <span className="font-semibold tracking-wider text-ink">
                    {letterHint(target.label)}
                  </span>
                </span>
              ) : (
                <span />
              )}
              {status === "asking" && (
                <button
                  type="button"
                  onClick={() => endStage(index, stage, "missed", 0)}
                  className="text-mute hover:text-ink"
                >
                  דלג
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
