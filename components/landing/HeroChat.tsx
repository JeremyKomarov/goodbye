"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { SystemPill } from "@/components/ui/SystemPill";
import { Ticks } from "@/components/ui/Ticks";
import { pad, splitCountdown } from "@/lib/hebrew";
import { useNow } from "@/lib/hooks/useNow";

type Line =
  | { kind: "in"; name: string; color: string; text: string; time: string }
  | { kind: "out"; text: string; time: string }
  | { kind: "system" };

const SCRIPT: Line[] = [
  {
    kind: "in",
    name: "דנה",
    color: "#e26ab6",
    text: "שמעתי מה קרה 😢 מחבקת",
    time: "16:02",
  },
  {
    kind: "in",
    name: "יוסי מהכספים",
    color: "#53bdeb",
    text: "אז אתה נשאר בקבוצה או...?",
    time: "16:03",
  },
  {
    kind: "out",
    text: "אין לי מושג מתי לצאת בלי שזה יהיה מביך 🫠",
    time: "16:05",
  },
  { kind: "system" },
];

// Each step shows a typing indicator first (for incoming lines), then the line.
const STEP_MS = 1100;

function FakeCountdown() {
  const now = useNow();
  // Counts down to the next 3-hour mark; purely decorative.
  const target = Math.ceil(now / 10_800_000) * 10_800_000;
  const { hours, minutes, seconds } = splitCountdown(target - now);
  return (
    <span dir="ltr" className="font-semibold tabular-nums">
      {now ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : "--:--:--"}
    </span>
  );
}

export function HeroChat() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timers = SCRIPT.map((_, i) =>
      setTimeout(() => setStep(i + 1), 500 + i * STEP_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  const shown = reduce ? SCRIPT.length : step;
  const typing = !reduce && step < SCRIPT.length && SCRIPT[step]?.kind === "in";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line/60 bg-night/80 shadow-2xl">
      <div className="flex shrink-0 items-center gap-3 bg-panel px-4 py-3">
        <div className="grid size-10 place-items-center rounded-full bg-raised text-xl">
          🚀
        </div>
        <div className="min-w-0">
          <div className="truncate font-semibold">צוות מוצר</div>
          <div className="truncate text-xs text-mute">
            דנה, יוסי מהכספים, את/ה ועוד 37
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-4 py-4">
        <AnimatePresence initial={false}>
          {SCRIPT.slice(0, shown).map((line, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className={
                line.kind === "out"
                  ? "self-end"
                  : line.kind === "in"
                    ? "self-start"
                    : "self-center pt-2"
              }
            >
              {line.kind === "in" && (
                <div className="bubble-in ms-2 max-w-[260px] px-3 pb-1.5 pt-1">
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: line.color }}
                  >
                    {line.name}
                  </div>
                  <div className="text-[15px] leading-snug">{line.text}</div>
                  <div
                    className="mt-0.5 text-left text-[11px] text-mute"
                    dir="ltr"
                  >
                    {line.time}
                  </div>
                </div>
              )}
              {line.kind === "out" && (
                <div className="bubble-out me-2 max-w-[260px] px-3 pb-1.5 pt-1.5">
                  <div className="text-[15px] leading-snug">{line.text}</div>
                  <div
                    className="mt-0.5 flex items-center justify-start gap-1 text-[11px] text-ink/60"
                    dir="ltr"
                  >
                    {line.time} <Ticks />
                  </div>
                </div>
              )}
              {line.kind === "system" && (
                <SystemPill className="text-sm">
                  הקבוצה הצביעה. יוצאים בעוד <FakeCountdown />
                </SystemPill>
              )}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bubble-in ms-2 flex w-fit items-center gap-1 self-start px-3 py-2.5"
              aria-hidden
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="size-1.5 rounded-full bg-mute"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: d * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
