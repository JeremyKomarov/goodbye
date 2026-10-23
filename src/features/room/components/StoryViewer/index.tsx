"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  STATUS_STORIES_NAMESPACE, statusStoriesKeys,
} from "@/features/room/components/StatusStories/StatusStories.keys.const";
import {
  LONG_PRESS_MS, STORY_MS, type StoryGroup, type StoryPosition,
} from "@/features/room/content/stories.const";
import { markSeen } from "@/features/room/utils/storiesSeen";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { Sheet } from "@/shared/components/Sheet";
import { StoryBars } from "./partials/StoryBars";
import { StoryGroupNav } from "./partials/StoryGroupNav";
import { storyViewerClasses } from "./StoryViewer.classes";

type FactsOf<Id extends StoryGroup["id"]> =
  (typeof statusStoriesKeys.groups)[Id] extends { facts: infer Facts } ? Facts[keyof Facts] : never;
type FactKey = FactsOf<StoryGroup["id"]>;

/** The strings key of a group's fact; the groups have different numbers of facts. */
function factKey(groupId: StoryGroup["id"], fact: string): FactKey {
  return (statusStoriesKeys.groups[groupId].facts as Record<string, FactKey>)[fact];
}

/**
 * The stories, one fact at a time, moving on by themselves. A tap on the forward side (the left,
 * in Hebrew) goes on, the other side goes back, a long press pauses; the arrow keys step too.
 * Watching a group to its end greys its ring.
 */
export function StoryViewer({
  groups,
  start,
  onClose,
}: {
  groups: readonly StoryGroup[];
  start: StoryPosition;
  onClose: () => void;
}) {
  const t = useTranslations(STATUS_STORIES_NAMESPACE);
  const [at, setAt] = useState(start);
  const bar = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const isPaused = useRef(false);
  const pressedAt = useRef(0);
  const group = groups[at.group];

  const go = useCallback((next: StoryPosition) => {
    elapsed.current = 0;
    setAt(next);
  }, []);

  const forward = useCallback(() => {
    if (at.fact + 1 < group.facts.length) return go({ group: at.group, fact: at.fact + 1 });
    markSeen(group.id);
    if (at.group + 1 < groups.length) return go({ group: at.group + 1, fact: 0 });
    onClose();
  }, [at, group, groups, go, onClose]);

  const back = useCallback(() => {
    if (at.fact > 0) return go({ group: at.group, fact: at.fact - 1 });
    if (at.group > 0)
      go({ group: at.group - 1, fact: groups[at.group - 1].facts.length - 1 });
  }, [at, groups, go]);

  // The bar fills on animation frames, written straight to the element, so pausing costs nothing.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (time: number) => {
      if (!isPaused.current) elapsed.current += time - last;
      last = time;
      const share = Math.min(100, (elapsed.current / STORY_MS) * 100);
      if (bar.current) bar.current.style.width = `${share}%`;
      if (elapsed.current >= STORY_MS) forward();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [at, forward]);

  useEffect(() => {
    const isRtl = document.documentElement.dir === "rtl";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") (isRtl ? forward : back)();
      if (event.key === "ArrowRight") (isRtl ? back : forward)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [forward, back]);

  function onStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (performance.now() - pressedAt.current > LONG_PRESS_MS) return;
    const box = event.currentTarget.getBoundingClientRect();
    const fromStart = event.clientX - box.left;
    const isRtl = document.documentElement.dir === "rtl";
    // The forward side is two thirds of the stage: the left in Hebrew, the right in English.
    const isForward = isRtl ? fromStart < (box.width * 2) / 3 : fromStart > box.width / 3;
    (isForward ? forward : back)();
  }

  return (
    <Sheet open onClose={onClose} title={t(statusStoriesKeys.groups[group.id].title)}>
      <div
        className={storyViewerClasses.root}
        style={{ "--story-color": group.color } as CSSProperties}
      >
        <StoryBars count={group.facts.length} current={at.fact} barRef={bar} />
        <StoryGroupNav
          groups={groups}
          current={at.group} onPick={(group) => go({ group, fact: 0 })} />
        <div
          className={storyViewerClasses.stage}
          onClick={onStageClick}
          onPointerDown={() => {
            isPaused.current = true;
            pressedAt.current = performance.now();
          }}
          onPointerUp={() => (isPaused.current = false)}
          onPointerLeave={() => (isPaused.current = false)}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={`${at.group}-${at.fact}`}
              className={storyViewerClasses.fact}
              aria-live="polite"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {t(factKey(group.id, group.facts[at.fact]))}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className={storyViewerClasses.steps}>
          <Button
            variant={BUTTON_VARIANTS.ghost}
            icon={ICON_NAMES.back}
            aria-label={t(statusStoriesKeys.previous)}
            onClick={back}
          />
          <p className={storyViewerClasses.hint}>{t(statusStoriesKeys.hint)}</p>
          <Button
            variant={BUTTON_VARIANTS.ghost}
            icon={ICON_NAMES.forward}
            aria-label={t(statusStoriesKeys.next)}
            onClick={forward}
          />
        </div>
      </div>
    </Sheet>
  );
}
