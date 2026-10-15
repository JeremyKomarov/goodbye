"use client";

import styles from "./StoryViewer.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { STORY_GROUPS } from "@/core/content/facts";
import { markSeen, readSeen, storyRing, subscribeSeen } from "../StatusStories/storySeen";

const STORY_MS = 6500;

export function StoryViewer({
  start,
  onClose,
}: {
  start: { group: number; fact: number };
  onClose: () => void;
}) {
  const [pos, setPos] = useState(start);
  const seen = useSyncExternalStore(subscribeSeen, readSeen, () => "");
  const barRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const elapsed = useRef(0);

  const group = STORY_GROUPS[pos.group];

  const next = useCallback(() => {
    elapsed.current = 0;
    const current = STORY_GROUPS[pos.group];
    if (pos.fact + 1 < current.facts.length) return setPos({ group: pos.group, fact: pos.fact + 1 });
    markSeen(current.id);
    if (pos.group + 1 < STORY_GROUPS.length) return setPos({ group: pos.group + 1, fact: 0 });
    onClose();
  }, [pos, onClose]);

  const jump = (group: number) => {
    elapsed.current = 0;
    setPos({ group, fact: 0 });
  };

  const prev = useCallback(() => {
    elapsed.current = 0;
    if (pos.fact > 0) return setPos({ group: pos.group, fact: pos.fact - 1 });
    if (pos.group > 0) setPos({ group: pos.group - 1, fact: STORY_GROUPS[pos.group - 1].facts.length - 1 });
  }, [pos]);

  // A long press pauses; it shouldn't also count as a tap.
  const pressStart = useRef(0);
  const longPress = useRef(false);
  const consumeLongPress = () => {
    const was = longPress.current;
    longPress.current = false;
    return was;
  };

  // Progress runs on rAF and writes the bar width directly, so pausing is free.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      if (!paused.current) elapsed.current += t - last;
      last = t;
      if (barRef.current)
        barRef.current.style.width = `${Math.min(100, (elapsed.current / STORY_MS) * 100)}%`;
      if (elapsed.current >= STORY_MS) next();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pos, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={group.title}
      className={styles.view11}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={styles.view12}
        style={{
          background: `linear-gradient(180deg, ${group.color}55, transparent 60%)`,
        }}
      >
        <div className={styles.view13}>
          {group.facts.map((_, i) => (
            <div
              key={i}
              className={styles.view14}
            >
              {i < pos.fact && <div className={styles.view15} />}
              {i === pos.fact && (
                <div ref={barRef} className={styles.view16} />
              )}
            </div>
          ))}
        </div>
        <div className={styles.view17}>
          <span
            className={styles.view18}
            style={{ background: group.color }}
          >
            {group.emoji}
          </span>
          <div className={styles.view19}>
            <div className={styles.view20}>{group.title}</div>
            <div className={styles.view21}>ידעת?</div>
          </div>
          {/* Every story, so the header ring isn't a dead end into the first one. */}
          <nav aria-label="כל העובדות" className={styles.view22}>
            {STORY_GROUPS.map((g, i) => (
              <button
                key={g.id}
                type="button"
                onClick={() => jump(i)}
                aria-label={g.title}
                aria-current={i === pos.group || undefined}
                title={g.title}
                className={[styles.view23, i === pos.group ? "" : styles.view24, ""].filter(Boolean).join(" ")}
                style={{
                  background:
                    i === pos.group
                      ? "var(--color-ink)"
                      : storyRing(seen.split(",").includes(g.id), g.color),
                }}
              >
                <span
                  className={styles.view25}
                  style={{ background: g.color }}
                >
                  {g.emoji}
                </span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className={styles.view26}
          >
            <svg
              viewBox="0 0 24 24"
              className={styles.view27}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          className={styles.view28}
          onPointerDown={() => {
            paused.current = true;
            pressStart.current = performance.now();
          }}
          onPointerUp={() => {
            paused.current = false;
            longPress.current = performance.now() - pressStart.current > 350;
          }}
          onPointerLeave={() => (paused.current = false)}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={`${pos.group}-${pos.fact}`}
              className={styles.view29}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {group.facts[pos.fact]}
            </motion.p>
          </AnimatePresence>
          {/* In RTL the "forward" side is the left. */}
          <button
            type="button"
            aria-label="לעובדה הקודמת"
            onClick={() => !consumeLongPress() && prev()}
            className={styles.view30}
          />
          <button
            type="button"
            aria-label="לעובדה הבאה"
            onClick={() => !consumeLongPress() && next()}
            className={styles.view31}
          />
        </div>
        <p className={styles.view32}>
          לחיצה ארוכה עוצרת. לחיצה בצד שמאל מעבירה הלאה.
        </p>
      </div>
    </motion.div>
  );
}
