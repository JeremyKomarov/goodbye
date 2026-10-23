"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { type PointerEvent, useRef, useState } from "react";
import { SCORE_RANGES } from "@/core/constants/games.const";
import type { GameProps } from "@/features/games/types/games.types";
import { BUTTON_SIZES, BUTTON_VARIANTS, Button } from "@/shared/components/Button";
import { useNow } from "@/shared/hooks/useNow";
import { runawayGameClasses } from "./RunawayGame.classes";
import { RUNAWAY_GAME_NAMESPACE, runawayGameKeys } from "./RunawayGame.keys.const";

const TAUNTS = Object.values(runawayGameKeys.taunt);
// How many spots it tries before jumping to the one farthest from the pointer.
const TRIES = 12;
// Each dodge lengthens the pause before it can dodge again by this much — it tires.
const TIRING_MS = 45;
// The button's half size, so the whole of it stays inside the arena.
const HALF = { x: 100, y: 48 };

type Point = { x: number; y: number };

/** The red "exit group" button runs from the pointer; the score is how long catching it took. */
export function RunawayGame({ onFinish }: GameProps) {
  const t = useTranslations(RUNAWAY_GAME_NAMESPACE);
  const locale = useLocale();
  const arena = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const lastDodge = useRef(0);
  const startPerf = useRef(0);
  const now = useNow();
  const scale = Math.max(0.55, 1 - dodges * 0.035);

  function start() {
    lastDodge.current = 0;
    startPerf.current = performance.now();
    setDodges(0);
    setPos({ x: 0, y: 0 });
    setStartedAt(Date.now());
    setIsPlaying(true);
  }

  const canDodge = () => performance.now() - lastDodge.current > dodges * TIRING_MS;

  function dodge(from: Point) {
    const box = arena.current;
    if (!box) return;
    const half = {
      x: Math.max(0, box.clientWidth / 2 - HALF.x),
      y: Math.max(0, box.clientHeight / 2 - HALF.y),
    };
    let best = pos;
    let bestDistance = -1;
    for (let i = 0; i < TRIES; i++) {
      const spot = { x: (Math.random() * 2 - 1) * half.x, y: (Math.random() * 2 - 1) * half.y };
      const distance = Math.hypot(spot.x - from.x, spot.y - from.y);
      if (distance > bestDistance) [best, bestDistance] = [spot, distance];
    }
    lastDodge.current = performance.now();
    setDodges((d) => d + 1);
    setPos(best);
    navigator.vibrate?.(6);
  }

  // The pointer, from the arena's centre — where the button's own position is measured from.
  function relative(event: PointerEvent): Point {
    const rect = arena.current!.getBoundingClientRect();
    return {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    };
  }

  // A mouse that comes close scares it off; a finger has no hover, so only a press counts.
  function onArenaMove(event: PointerEvent) {
    if (!isPlaying || event.pointerType !== "mouse") return;
    const p = relative(event);
    if (Math.hypot(p.x - pos.x, p.y - pos.y) < 70 + 50 * scale && canDodge()) dodge(p);
  }

  function onPress(event: PointerEvent) {
    event.preventDefault();
    if (!isPlaying) return;
    if (canDodge()) return dodge(relative(event));
    setIsPlaying(false);
    navigator.vibrate?.([20, 30, 60]);
    const ms = Math.round(performance.now() - startPerf.current);
    onFinish(Math.min(SCORE_RANGES.runaway.max, Math.max(SCORE_RANGES.runaway.min, ms)));
  }

  const elapsed = isPlaying && now ? Math.max(0, now - startedAt) : 0;
  const seconds = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(elapsed / 1000);

  return (
    <div className={runawayGameClasses.root}>
      <div className={runawayGameClasses.bar}>
        <span className={runawayGameClasses.note}>
          {isPlaying ? t(runawayGameKeys.dodges, { count: dodges }) : t(runawayGameKeys.tiring)}
        </span>
        <span className={runawayGameClasses.clock} dir="ltr">
          {t(runawayGameKeys.elapsed, { seconds })}
        </span>
      </div>
      <div ref={arena} className={runawayGameClasses.arena} onPointerMove={onArenaMove}>
        {isPlaying ? (
          <motion.button
            type="button"
            className={runawayGameClasses.exit}
            onPointerDown={onPress}
            animate={{ x: pos.x, y: pos.y, scale }}
            // Nearly bounce-free so a long jump doesn't overshoot the arena; quicker as it tires.
            transition={{
              type: "spring",
              bounce: 0.1,
              duration: Math.max(0.14, 0.35 - dodges * 0.012),
            }}
          >
            {t(TAUNTS[dodges % TAUNTS.length])}
          </motion.button>
        ) : (
          <div className={runawayGameClasses.intro}>
            <p className={runawayGameClasses.lead}>{t(runawayGameKeys.intro)}</p>
            <Button variant={BUTTON_VARIANTS.danger} size={BUTTON_SIZES.lg} onClick={start}>
              {t(runawayGameKeys.start)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
