"use client";

import styles from "./RunawayGame.module.scss";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useNow } from "@/core/hooks/useNow";

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
    // Keep the whole button inside the arena, with room for the small spring overshoot.
    const halfW = Math.max(0, arena.clientWidth / 2 - 100);
    const halfH = Math.max(0, arena.clientHeight / 2 - 48);
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
    <div className={styles.view1}>
      <div className={styles.view2}>
        <span className={styles.view3}>
          {playing ? `התחמקויות: ${dodges}` : "הכפתור מתעייף עם כל בריחה"}
        </span>
        <span className={styles.view4}>
          {(elapsed / 1000).toFixed(1)} שנ׳
        </span>
      </div>
      <div
        ref={arenaRef}
        onPointerMove={onArenaMove}
        className={styles.view5}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgb(241 92 109 / 0.08), transparent 70%)",
        }}
      >
        {!playing ? (
          <div className={styles.view6}>
            <div>
              <p className={styles.view7}>
                הכפתור האדום בורח מכם. תפסו אותו כמה שיותר מהר.
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={start}
                className={styles.view8}
              >
                התחלה
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            type="button"
            onPointerDown={onButtonDown}
            className={styles.view9}
            animate={{ x: pos.x, y: pos.y, scale }}
            // Nearly bounce-free so big jumps don't overshoot the arena; quicker as it tires.
            transition={{
              type: "spring",
              bounce: 0.1,
              duration: Math.max(0.14, 0.35 - dodges * 0.012),
            }}
          >
            {TAUNTS[dodges % TAUNTS.length]}
          </motion.button>
        )}
      </div>
    </div>
  );
}
