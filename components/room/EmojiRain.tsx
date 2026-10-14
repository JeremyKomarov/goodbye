"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type Drop = {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  spin: number;
};

let nextId = 0;

/** Full-screen emoji shower, fed by local taps and Realtime broadcasts. */
export function EmojiRain({
  subscribe,
}: {
  subscribe: (listener: (emoji: string) => void) => () => void;
}) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const reduce = useReducedMotion();

  useEffect(
    () =>
      subscribe((emoji) => {
        const count = reduce ? 4 : 16;
        const batch: Drop[] = Array.from({ length: count }, () => ({
          id: nextId++,
          emoji,
          x: Math.random() * 100,
          delay: Math.random() * 0.6,
          duration: 2.2 + Math.random() * 1.4,
          size: 22 + Math.random() * 22,
          drift: (Math.random() - 0.5) * 80,
          spin: (Math.random() - 0.5) * 120,
        }));
        setDrops((prev) => [...prev.slice(-80), ...batch]);
        const ids = new Set(batch.map((d) => d.id));
        setTimeout(
          () => setDrops((prev) => prev.filter((d) => !ids.has(d.id))),
          4500,
        );
      }),
    [subscribe, reduce],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden
    >
      {drops.map((d) => (
        <motion.span
          key={d.id}
          className="absolute top-0"
          style={{ left: `${d.x}%`, fontSize: d.size }}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={
            reduce
              ? { opacity: [0, 1, 0], y: "40vh" }
              : { y: "110vh", x: d.drift, rotate: d.spin }
          }
          transition={{ duration: d.duration, delay: d.delay, ease: "easeIn" }}
        >
          {d.emoji}
        </motion.span>
      ))}
    </div>
  );
}
