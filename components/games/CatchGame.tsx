"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DURATION = 30;

type Kind = "msg" | "flower" | "boss" | "gold";
const KINDS: Record<
  Kind,
  { points: number; texts: string[]; className: string; weight: number }
> = {
  msg: {
    points: 10,
    texts: [
      "+99 הודעות",
      "מישהו שם?",
      "👍",
      "ישיבה ב-9:00",
      "מי לקח לי את הקפה?",
      "הקלטה של 4 דק׳",
      "מעלה את זה שוב",
    ],
    className: "bg-raised text-ink",
    weight: 0.55,
  },
  flower: {
    points: 15,
    texts: ["בוקר טוב 🌸", "שבוע טוב 🌻", "שבת שלום 🌹"],
    className: "bg-[#4a3350] text-ink",
    weight: 0.2,
  },
  boss: {
    points: -30,
    texts: ["הבוס: יש לך דקה?", "הבוס: אפשר לדבר?", "הבוס: דחוף!!"],
    className: "bg-exit text-night",
    weight: 0.18,
  },
  gold: {
    points: 50,
    texts: ["יציאה מהקבוצה ✨"],
    className: "bg-pill text-night",
    weight: 0.07,
  },
};

type Bubble = {
  id: number;
  kind: Kind;
  text: string;
  x: number;
  y: number;
  speed: number;
};
type Popup = { id: number; x: number; y: number; points: number };
type Frame = { bubbles: Bubble[]; score: number; timeLeft: number };

function pickKind(): Kind {
  let r = Math.random();
  for (const kind of Object.keys(KINDS) as Kind[]) {
    r -= KINDS[kind].weight;
    if (r <= 0) return kind;
  }
  return "msg";
}

/** Tap falling notifications for points; the boss costs you. 30 seconds. */
export function CatchGame({ onFinish }: { onFinish: (score: number) => void }) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const sim = useRef<{ bubbles: Bubble[]; score: number; nextId: number }>({
    bubbles: [],
    score: 0,
    nextId: 0,
  });
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState<Frame>({
    bubbles: [],
    score: 0,
    timeLeft: DURATION,
  });
  const [popups, setPopups] = useState<Popup[]>([]);
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (!playing) return;
    const s = sim.current;
    let raf = 0;
    let last = performance.now();
    const startedAt = last;
    let spawnAcc = 0;

    const loop = (t: number) => {
      const dt = Math.min(50, t - last) / 1000;
      last = t;
      const elapsed = (t - startedAt) / 1000;
      if (elapsed >= DURATION) {
        setPlaying(false);
        finishRef.current(s.score);
        return;
      }
      const progress = elapsed / DURATION;
      const height = arenaRef.current?.clientHeight ?? 460;

      spawnAcc += dt * 1000;
      const interval = 640 - 380 * progress;
      while (spawnAcc > interval) {
        spawnAcc -= interval;
        const kind = pickKind();
        const texts = KINDS[kind].texts;
        s.bubbles.push({
          id: s.nextId++,
          kind,
          text: texts[Math.floor(Math.random() * texts.length)],
          x: 4 + Math.random() * 56,
          y: -48,
          speed:
            (90 + 140 * progress) *
            (kind === "gold" ? 1.5 : 0.85 + Math.random() * 0.3),
        });
      }
      for (const b of s.bubbles) b.y += b.speed * dt;
      s.bubbles = s.bubbles.filter((b) => b.y < height + 10);

      setFrame({
        bubbles: s.bubbles.slice(),
        score: s.score,
        timeLeft: DURATION - elapsed,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  function start() {
    sim.current = { bubbles: [], score: 0, nextId: 0 };
    setPopups([]);
    setPlaying(true);
  }

  function pop(e: React.PointerEvent, id: number) {
    e.preventDefault();
    const s = sim.current;
    const bubble = s.bubbles.find((b) => b.id === id);
    if (!bubble) return;
    s.bubbles = s.bubbles.filter((b) => b.id !== id);
    const points = KINDS[bubble.kind].points;
    s.score += points;
    navigator.vibrate?.(points < 0 ? [30, 40, 30] : 8);
    const popup = { id, x: bubble.x, y: bubble.y, points };
    setPopups((prev) => [...prev.slice(-12), popup]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 700);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between px-1 short:mb-2">
        <span className="font-display text-3xl tabular-nums leading-none">
          {frame.score} נק׳
        </span>
        <span
          className={`font-display text-3xl tabular-nums leading-none ${playing && frame.timeLeft < 5 ? "text-exit" : ""}`}
        >
          {Math.ceil(playing ? frame.timeLeft : DURATION)} שנ׳
        </span>
      </div>
      <div
        ref={arenaRef}
        className="relative min-h-40 flex-1 touch-none select-none overflow-hidden rounded-3xl bg-panel/90"
      >
        {!playing && (
          <div className="absolute inset-0 z-10 grid place-items-center p-6 text-center tiny:p-3">
            <div>
              <p className="mb-2 text-lg text-ink/85">
                ההתראות נופלות. פוצצו כמה שיותר לפני שהן קוברות אתכם.
              </p>
              <p className="mb-5 text-sm text-mute tiny:mb-3">
                פרחים של בוקר טוב שווים יותר, יציאה מהקבוצה שווה הכי הרבה, ועל
                הבוס לא לוחצים.
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={start}
                className="rounded-2xl bg-tick px-8 py-4 text-lg font-semibold text-night tiny:py-3"
              >
                {frame.score ? "עוד סיבוב" : "התחלה"}
              </motion.button>
            </div>
          </div>
        )}

        {playing &&
          frame.bubbles.map((b) => (
            <button
              key={b.id}
              type="button"
              onPointerDown={(e) => pop(e, b.id)}
              className={`absolute max-w-[60%] rounded-xl px-3 py-2 text-sm font-medium shadow-lg ${KINDS[b.kind].className}`}
              style={{ left: `${b.x}%`, transform: `translateY(${b.y}px)` }}
            >
              {b.text}
            </button>
          ))}

        <AnimatePresence>
          {popups.map((p) => (
            <motion.span
              key={p.id}
              className={`pointer-events-none absolute font-display text-3xl font-bold ${p.points < 0 ? "text-exit" : "text-signal"}`}
              style={{ left: `${p.x + 8}%`, top: p.y }}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -50, scale: 1.2 }}
              transition={{ duration: 0.7 }}
              dir="ltr"
            >
              {p.points > 0 ? `+${p.points}` : p.points}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
