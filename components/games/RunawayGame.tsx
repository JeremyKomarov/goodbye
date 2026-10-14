"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useNow } from "@/lib/hooks/useNow";

const TAUNTS = [
  "יציאה מהקבוצה",
  "עוד לא!",
  "רגע, יש עוד הודעה",
  "בוקר טוב 🌸",
  "אולי מחר?",
  "מי יסכם את הישיבה?",
  "כמעט!",
  "רק עוד מם אחד",
  "נו באמת",
  "תפסת? לא.",
  "אני עוד צריך את הקבוצה",
  "חכה לפיצה של יום חמישי",
];

/** The red "exit group" button runs away. It tires: every dodge lengthens its cooldown. */
export function RunawayGame({ onFinish }: { onFinish: (ms: number) => void }) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const dodgeCount = useRef(0);
  const lastDodge = useRef(0);
  const startPerf = useRef(0);
  const now = useNow();

  const scale = Math.max(0.55, 1 - dodges * 0.035);

  function start() {
    dodgeCount.current = 0;
    lastDodge.current = 0;
    startPerf.current = performance.now();
    setDodges(0);
    setPos({ x: 0, y: 0 });
    setStartedAt(Date.now());
    setPlaying(true);
  }

  const canDodge = () =>
    performance.now() - lastDodge.current > dodgeCount.current * 45;

  /** Jump to the spot (out of a few random tries) farthest from the pointer. */
  function dodge(px: number, py: number) {
    const arena = arenaRef.current;
    if (!arena) return;
    const halfW = arena.clientWidth / 2 - 90;
    const halfH = arena.clientHeight / 2 - 32;
    let best = pos;
    let bestDist = -1;
    for (let i = 0; i < 12; i++) {
      const candidate = {
        x: (Math.random() * 2 - 1) * halfW,
        y: (Math.random() * 2 - 1) * halfH,
      };
      const dist = Math.hypot(candidate.x - px, candidate.y - py);
      if (dist > bestDist) {
        bestDist = dist;
        best = candidate;
      }
    }
    dodgeCount.current += 1;
    lastDodge.current = performance.now();
    setDodges(dodgeCount.current);
    setPos(best);
    navigator.vibrate?.(6);
  }

  function relative(e: React.PointerEvent) {
    const rect = arenaRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
  }

  function onArenaMove(e: React.PointerEvent) {
    if (!playing || e.pointerType !== "mouse") return;
    const p = relative(e);
    if (Math.hypot(p.x - pos.x, p.y - pos.y) < 70 + 50 * scale && canDodge())
      dodge(p.x, p.y);
  }

  function onButtonDown(e: React.PointerEvent) {
    e.preventDefault();
    if (!playing) return;
    const p = relative(e);
    if (canDodge()) return dodge(p.x, p.y);
    setPlaying(false);
    navigator.vibrate?.([20, 30, 60]);
    onFinish(Math.max(250, Math.round(performance.now() - startPerf.current)));
  }

  const elapsed = playing && now ? Math.max(0, now - startedAt) : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1 text-sm">
        <span className="text-mute">
          {playing ? `התחמקויות: ${dodges}` : "הכפתור מתעייף עם כל בריחה"}
        </span>
        <span className="font-display text-3xl tabular-nums leading-none">
          {(elapsed / 1000).toFixed(1)} שנ׳
        </span>
      </div>
      <div
        ref={arenaRef}
        onPointerMove={onArenaMove}
        className="relative h-[26rem] touch-none select-none overflow-hidden rounded-3xl bg-panel/90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgb(241 92 109 / 0.08), transparent 70%)",
        }}
      >
        {!playing ? (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="mb-5 text-lg text-ink/85">
                הכפתור האדום בורח מכם. תפסו אותו כמה שיותר מהר.
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={start}
                className="rounded-2xl bg-exit px-8 py-4 text-lg font-semibold text-night"
              >
                התחלה
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            type="button"
            onPointerDown={onButtonDown}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl bg-exit px-5 py-3.5 font-semibold text-night shadow-[0_8px_30px_-6px] shadow-exit/70"
            animate={{ x: pos.x, y: pos.y, scale }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 300 + dodges * 40,
            }}
          >
            {TAUNTS[dodges % TAUNTS.length]}
          </motion.button>
        )}
      </div>
    </div>
  );
}
