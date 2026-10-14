"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PictureStage } from "@/components/games/PictureStage";
import { matches } from "@/lib/answers";
import {
  PICTURES,
  type PicturePuzzle,
  TOP_SHOWN,
} from "@/lib/content/pictures";

const ROUND = 6;
const POINTS = 150;
/** How many pictures in a round are honest (the top thing is the answer): 2 to 4. */
const HONEST_MIN = 2;
const HONEST_MAX = 4;

type Status = "asking" | "correct" | "wrong" | "skipped";

function shuffle<T>(list: T[]) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = { puzzle: PicturePuzzle; honest: boolean };

/** Pictures from recent rounds; new rounds show the others first, so they don't repeat. */
let seen = new Set<string>();

function dealRound(): Card[] {
  const fresh = shuffle(PICTURES.filter((p) => !seen.has(p.id)));
  const rest = shuffle(PICTURES.filter((p) => seen.has(p.id)));
  const picked = shuffle([...fresh, ...rest].slice(0, ROUND));
  // Once every picture has had a turn, start the cycle over from this round.
  if (fresh.length <= ROUND) seen = new Set();
  for (const p of picked) seen.add(p.id);
  const honestCount =
    HONEST_MIN + Math.floor(Math.random() * (HONEST_MAX - HONEST_MIN + 1));
  const honest = new Set(shuffle(picked.map((_, i) => i)).slice(0, honestCount));
  return picked.map((puzzle, i) => ({ puzzle, honest: honest.has(i) }));
}

/**
 * "מה בתמונה?": only the top of the picture shows, and it looks like one thing.
 * Sometimes it is, and sometimes the picture is really something else. One
 * guess, then the whole picture is revealed. Only the real thing counts.
 */
export function PictureGame({
  onFinish,
}: {
  onFinish: (score: number) => void;
}) {
  const [round, setRound] = useState<Card[] | null>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("asking");
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const done = status !== "asking";

  // After the guess, Enter moves on to the next picture.
  useEffect(() => {
    if (done) nextRef.current?.focus({ preventScroll: true });
  }, [done, index]);

  function ask(i: number) {
    setIndex(i);
    setStatus("asking");
    setGuess("");
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    );
  }

  function reveal(outcome: Exclude<Status, "asking">) {
    setStatus(outcome);
    if (outcome === "correct") setScore((v) => v + POINTS);
    navigator.vibrate?.(outcome === "correct" ? 12 : [30, 40, 30]);
  }

  function start() {
    const cards = dealRound();
    // Warm the cache so the reveal shows fully drawn pictures.
    for (const icon of new Set(
      cards.flatMap(({ puzzle: p }) =>
        [...p.top, ...p.bottom].flatMap((l) => ("icon" in l ? [l.icon] : [])),
      ),
    )) {
      new window.Image().src = `/picture-game/${icon}.svg`;
    }
    setRound(cards);
    setScore(0);
    ask(0);
  }

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!round || done || !guess.trim()) return;
    const { puzzle, honest } = round[index];
    // In a trick picture, naming the top part (the decoy) is just a wrong guess.
    const answer = honest ? puzzle.decoy : puzzle.truth;
    reveal(matches(guess, answer.answers) ? "correct" : "wrong");
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
          רואים רק את החלק העליון של התמונה ויש ניחוש אחד. אחרי הניחוש כל התמונה
          נחשפת.
        </p>
        <p className="mb-5 text-sm text-mute">
          זהירות, התמונות מטעות 😉 ניחוש נכון שווה {POINTS} נק׳. {ROUND} תמונות.
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

  const { puzzle, honest } = round[index];
  const answer = honest ? puzzle.decoy : puzzle.truth;
  const last = index === round.length - 1;
  const verdict: Record<
    Exclude<Status, "asking">,
    { text: string; className: string }
  > = {
    correct: { text: `✓ נכון! +${POINTS}`, className: "text-signal" },
    wrong: { text: `לא, זה ${answer.label}`, className: "text-exit" },
    skipped: { text: `זה ${answer.label}`, className: "text-mute" },
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between text-sm text-mute">
        <span>
          תמונה {index + 1} מתוך {round.length}
        </span>
        <span className="tabular-nums">{score} נק׳</span>
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
            honest={honest}
            shown={done ? 100 : TOP_SHOWN}
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
              className={`text-lg font-semibold ${verdict[status].className}`}
            >
              {verdict[status].text}
            </p>
            <button
              ref={nextRef}
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
                ניחוש אחד בלבד, שווה{" "}
                <span className="font-semibold text-pill">{POINTS}</span> נק׳
              </span>
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="picture-guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
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
                ניחוש
              </button>
            </div>
            <div className="mt-2 flex h-6 items-center justify-end text-sm">
              <button
                type="button"
                onClick={() => reveal("skipped")}
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
