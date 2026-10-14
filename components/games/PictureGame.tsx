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
/** How much of the picture shows at each step, and what a right answer is worth then. */
const STEPS = [
  { shown: 25, points: 150, label: "רבע" },
  { shown: 50, points: 100, label: "חצי" },
  { shown: 75, points: 60, label: "שלושה רבעים" },
  { shown: 100, points: 30, label: "הכל" },
] as const;
const STEP_MS = 5000;
/** Extra time after the whole picture is showing. */
const LAST_MS = 8000;
const TOTAL_MS = STEP_MS * (STEPS.length - 1) + LAST_MS;

type Status = "asking" | "correct" | "missed";
type Feedback = { kind: "trap" | "wrong"; text: string } | null;

function shuffle<T>(list: T[]) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * "מה בתמונה?": the top quarter looks like one thing, but the picture is really
 * something else. The curtain lowers a quarter every few seconds; name the real
 * thing as early as you can. Naming the top (the decoy) is the trap.
 */
export function PictureGame({
  onFinish,
}: {
  onFinish: (score: number) => void;
}) {
  const [round, setRound] = useState<PicturePuzzle[] | null>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("asking");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState(0);
  const [guess, setGuess] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputScope, animateInput] = useAnimate();
  const now = useNow();

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  function ask(i: number) {
    clearTimers();
    setIndex(i);
    setStep(0);
    setStatus("asking");
    setFeedback(null);
    setGuess("");
    setGained(0);
    setStartedAt(clockNow());
    for (let s = 1; s < STEPS.length; s++)
      timers.current.push(setTimeout(() => setStep(s), STEP_MS * s));
    timers.current.push(setTimeout(() => finish("missed", 0), TOTAL_MS));
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    );
  }

  function finish(outcome: Status, points: number) {
    clearTimers();
    setStatus(outcome);
    setStep(STEPS.length - 1);
    setGained(points);
    if (points) setScore((v) => v + points);
    navigator.vibrate?.(outcome === "correct" ? 12 : [30, 40, 30]);
  }

  function start() {
    const picked = shuffle(PICTURES).slice(0, ROUND);
    // Warm the cache so the curtain lowers onto fully drawn pictures.
    for (const icon of new Set(
      picked.flatMap((p) =>
        [...p.top, ...p.bottom].flatMap((l) => ("icon" in l ? [l.icon] : [])),
      ),
    )) {
      new window.Image().src = `/picture-game/${icon}.svg`;
    }
    setRound(picked);
    setScore(0);
    ask(0);
  }

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!round || status !== "asking" || !guess.trim()) return;
    const puzzle = round[index];
    if (matches(guess, puzzle.truth.answers)) {
      finish("correct", STEPS[step].points);
      return;
    }
    // Naming the top part is exactly the trap the picture sets.
    const fell = matches(guess, puzzle.decoy.answers);
    setFeedback(
      fell
        ? { kind: "trap", text: `😂 נפלת בפח! זה לא ${puzzle.decoy.label}` }
        : { kind: "wrong", text: "לא, תסתכלו שוב" },
    );
    navigator.vibrate?.([20, 30, 20]);
    animateInput(
      inputScope.current,
      { x: [0, -10, 10, -6, 6, 0] },
      { duration: 0.4 },
    );
    inputRef.current?.select();
  }

  function next() {
    if (!round) return;
    if (index + 1 < round.length) ask(index + 1);
    else onFinish(score);
  }

  if (!round) {
    return (
      <div className="my-auto rounded-3xl bg-panel/90 p-6 text-center">
        <p className="mb-2 text-lg text-ink/85">
          רואים רק את החלק העליון של התמונה, וכל כמה שניות נחשף עוד רבע. נחשו מה
          זה באמת.
        </p>
        <p className="mb-5 text-sm text-mute">
          זהירות, התמונות מטעות 😉 כמה שפחות רואים, יותר נקודות. {ROUND} תמונות.
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
  const elapsed = now && startedAt ? now - startedAt : 0;
  const left = status === "asking" ? Math.max(0, TOTAL_MS - elapsed) : 0;
  const showHint =
    status === "asking" && step === STEPS.length - 1 && left < LAST_MS / 2;
  const done = status !== "asking";
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
          className={`h-full rounded-full ${left < LAST_MS / 2 ? "bg-exit" : "bg-pill"}`}
          animate={{ width: `${(left / TOTAL_MS) * 100}%` }}
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
            shown={STEPS[step].shown}
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
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="picture-guess" className="font-semibold">
                מה בתמונה?
              </label>
              <span className="text-xs text-mute">
                רואים {STEPS[step].label}, שווה{" "}
                <span className="font-semibold text-pill">
                  {STEPS[step].points}
                </span>{" "}
                נק׳
              </span>
            </div>
            <div ref={inputScope} className="flex gap-2">
              <input
                ref={inputRef}
                id="picture-guess"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  setFeedback(null);
                }}
                placeholder="כתבו כאן"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="done"
                maxLength={40}
                className="min-w-0 flex-1 rounded-2xl bg-raised px-4 py-3 text-lg outline-none placeholder:text-mute/70 focus:ring-2 focus:ring-pill/70"
              />
              <button
                type="submit"
                disabled={!guess.trim()}
                className="shrink-0 rounded-2xl bg-pill px-5 font-semibold text-night disabled:opacity-40"
              >
                בדיקה
              </button>
            </div>
            <div
              className="mt-2 flex h-6 items-center justify-between text-sm"
              aria-live="polite"
            >
              {feedback ? (
                <span
                  className={
                    feedback.kind === "trap"
                      ? "font-semibold text-pill"
                      : "text-exit"
                  }
                >
                  {feedback.text}
                </span>
              ) : showHint ? (
                <span className="text-mute">
                  רמז:{" "}
                  <span className="font-semibold tracking-wider text-ink">
                    {letterHint(puzzle.truth.label)}
                  </span>
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => finish("missed", 0)}
                className="text-mute hover:text-ink"
              >
                דלג
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
