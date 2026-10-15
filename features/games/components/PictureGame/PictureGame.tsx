"use client";

import styles from "./PictureGame.module.scss";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PictureStage } from "@/features/games/components/PictureStage/PictureStage";
import { matches } from "@/core/answers";
import {
  PICTURES,
  type PicturePuzzle,
  TOP_SHOWN,
} from "@/core/content/pictures";

const ROUND = 6;
const POINTS = 150;

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
  // Exactly one picture per round is honest (the top thing is the answer), at a random spot.
  const honest = Math.floor(Math.random() * picked.length);
  return picked.map((puzzle, i) => ({ puzzle, honest: i === honest }));
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
      <div className={styles.view1}>
        <p className={styles.view2}>
          רואים רק את החלק העליון של התמונה ויש ניחוש אחד. אחרי הניחוש כל התמונה
          נחשפת.
        </p>
        <p className={styles.view3}>
          זהירות, התמונות מטעות 😉 ניחוש נכון שווה {POINTS} נק׳. {ROUND} תמונות.
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={start}
          className={styles.view4}
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
    correct: { text: `✓ נכון! +${POINTS}`, className: styles.correct },
    wrong: { text: `לא, זה ${answer.label}`, className: styles.wrong },
    skipped: { text: `זה ${answer.label}`, className: styles.skipped },
  };

  return (
    <div className={styles.view5}>
      <div className={styles.view6}>
        <span>
          תמונה {index + 1} מתוך {round.length}
        </span>
        <span className={styles.view7}>{score} נק׳</span>
      </div>

      {/* The picture takes whatever room is left, staying square. Landscape phones put the guess beside it. */}
      <div className={styles.view8}>
      <div
        className={styles.view9}
        style={{ containerType: "size" }}
      >
        <div className={styles.view10}>
          <PictureStage
            key={puzzle.id}
            puzzle={puzzle}
            honest={honest}
            shown={done ? 100 : TOP_SHOWN}
            className={styles.view11}
          />
        </div>
      </div>

      <div className={styles.view12}>
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.view13}
          >
            <p className={[styles.view14, verdict[status].className, ""].filter(Boolean).join(" ")}>
              {verdict[status].text}
            </p>
            <button
              ref={nextRef}
              type="button"
              onClick={next}
              className={styles.view15}
            >
              {last ? "לתוצאה" : "לתמונה הבאה"}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={submit}>
            <div className={styles.view16}>
              <label htmlFor="picture-guess" className={styles.view17}>
                מה בתמונה?
              </label>
              <span className={styles.view18}>
                ניחוש אחד בלבד, שווה{" "}
                <span className={styles.view19}>{POINTS}</span> נק׳
              </span>
            </div>
            <div className={styles.view20}>
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
                className={styles.view21}
              />
              <button
                type="submit"
                disabled={!guess.trim()}
                className={styles.view22}
              >
                ניחוש
              </button>
            </div>
            <div className={styles.view23}>
              <button
                type="button"
                onClick={() => reveal("skipped")}
                className={styles.view24}
              >
                דלג
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}
