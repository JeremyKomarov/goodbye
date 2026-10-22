"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { emojiRainClasses } from "./EmojiRain.classes";
import { RAIN_DROPS, RAIN_DROPS_REDUCED, RAIN_LIFETIME_MS, RAIN_MAX } from "./EmojiRain.const";

interface Drop {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  spin: number;
}

type RainListener = (emoji: string) => void;

let nextId = 0;

function dropsOf(emoji: string, count: number): Drop[] {
  return Array.from({ length: count }, () => ({
    id: nextId++,
    emoji,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.4,
    size: 22 + Math.random() * 22,
    drift: (Math.random() - 0.5) * 80,
    spin: (Math.random() - 0.5) * 120,
  }));
}

/** A full-screen emoji shower, fed by this screen's taps and everyone else's, over the channel. */
export function EmojiRain({ subscribe }: { subscribe: (listener: RainListener) => () => void }) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const isReduced = useReducedMotion();

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const unsubscribe = subscribe((emoji) => {
      const batch = dropsOf(emoji, isReduced ? RAIN_DROPS_REDUCED : RAIN_DROPS);
      setDrops((previous) => [...previous.slice(-RAIN_MAX), ...batch]);
      const ids = new Set(batch.map((drop) => drop.id));
      const timer = setTimeout(() => {
        timers.delete(timer);
        setDrops((previous) => previous.filter((drop) => !ids.has(drop.id)));
      }, RAIN_LIFETIME_MS);
      timers.add(timer);
    });
    return () => {
      unsubscribe();
      timers.forEach(clearTimeout);
    };
  }, [subscribe, isReduced]);

  return (
    <div className={emojiRainClasses.root} aria-hidden>
      {drops.map((drop) => (
        <motion.span
          key={drop.id}
          className={emojiRainClasses.drop}
          style={{ "--drop-x": `${drop.x}%`, "--drop-size": `${drop.size}px` } as CSSProperties}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={
            isReduced
              ? { opacity: [0, 1, 0], y: "40vh" }
              : { y: "110vh", x: drop.drift, rotate: drop.spin }
          }
          transition={{ duration: drop.duration, delay: drop.delay, ease: "easeIn" }}
        >
          {drop.emoji}
        </motion.span>
      ))}
    </div>
  );
}
