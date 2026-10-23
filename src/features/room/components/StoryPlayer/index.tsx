"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { LONG_PRESS_MS } from "@/features/room/content/stories.const";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { Sheet } from "@/shared/components/Sheet";
import { StoryBars } from "./partials/StoryBars";
import { storyPlayerClasses } from "./StoryPlayer.classes";

interface StoryPlayerProps {
  title: string;
  /** A colour token's value, washed behind the slide. */
  color: string;
  /** The bars, and the one filling now. */
  count: number;
  current: number;
  /** Changes with every slide, and restarts its clock. */
  slideKey: string;
  /** How long this slide stays before it moves on by itself. */
  durationMs: number;
  onForward: () => void;
  onBack: () => void;
  onClose: () => void;
  labels: { previous: string; next: string; hint: string };
  /** Above the slide, under the bars — the stories' groups. */
  header?: ReactNode;
  children: ReactNode;
}

/**
 * Slides that move on by themselves, in the kit's sheet. A tap on the forward side (the left, in
 * Hebrew) goes on, the other side goes back, a long press pauses; the arrow keys and two buttons
 * step too. What a slide says, and where forward leads, are the caller's.
 */
export function StoryPlayer({
  title, color, count, current, slideKey, durationMs,
  onForward, onBack, onClose, labels, header, children,
}: StoryPlayerProps) {
  const bar = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const isPaused = useRef(false);
  const pressedAt = useRef(0);

  // Each slide starts its clock again; a held press keeps counting from where it paused.
  useEffect(() => {
    elapsed.current = 0;
  }, [slideKey]);

  // The bar fills on animation frames, written straight to the element, so pausing costs nothing.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (time: number) => {
      if (!isPaused.current) elapsed.current += time - last;
      last = time;
      const share = Math.min(100, (elapsed.current / durationMs) * 100);
      if (bar.current) bar.current.style.width = `${share}%`;
      if (elapsed.current >= durationMs) onForward();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [slideKey, durationMs, onForward]);

  useEffect(() => {
    const isRtl = document.documentElement.dir === "rtl";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") (isRtl ? onForward : onBack)();
      if (event.key === "ArrowRight") (isRtl ? onBack : onForward)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onForward, onBack]);

  const onStageClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (performance.now() - pressedAt.current > LONG_PRESS_MS) return;
      const box = event.currentTarget.getBoundingClientRect();
      const fromStart = event.clientX - box.left;
      const isRtl = document.documentElement.dir === "rtl";
      // The forward side is two thirds of the stage: the left in Hebrew, the right in English.
      const isForward = isRtl ? fromStart < (box.width * 2) / 3 : fromStart > box.width / 3;
      (isForward ? onForward : onBack)();
    },
    [onForward, onBack],
  );

  return (
    <Sheet open onClose={onClose} title={title}>
      <div className={storyPlayerClasses.root} style={{ "--story-color": color } as CSSProperties}>
        <StoryBars count={count} current={current} barRef={bar} />
        {header}
        <div
          className={storyPlayerClasses.stage}
          onClick={onStageClick}
          onPointerDown={() => {
            isPaused.current = true;
            pressedAt.current = performance.now();
          }}
          onPointerUp={() => (isPaused.current = false)}
          onPointerLeave={() => (isPaused.current = false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slideKey}
              className={storyPlayerClasses.slide}
              aria-live="polite"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={storyPlayerClasses.steps}>
          <Button
            variant={BUTTON_VARIANTS.ghost}
            icon={ICON_NAMES.back}
            aria-label={labels.previous}
            onClick={onBack}
          />
          <p className={storyPlayerClasses.hint}>{labels.hint}</p>
          <Button
            variant={BUTTON_VARIANTS.ghost}
            icon={ICON_NAMES.forward}
            aria-label={labels.next}
            onClick={onForward}
          />
        </div>
      </div>
    </Sheet>
  );
}
