"use client";

import styles from "./StatusStories.module.scss";
import { AnimatePresence } from "motion/react";
import {
  type ReactNode,
  useState,
  useSyncExternalStore,
} from "react";
import { STORY_GROUPS } from "@/core/content/facts";
import { StoryViewer } from "../StoryViewer/StoryViewer";
import { readSeen, storyRing, subscribeSeen } from "./storySeen";

/** Seen story groups, and which one is open in the viewer. */
function useStories() {
  const seen = useSyncExternalStore(subscribeSeen, readSeen, () => "");
  const [open, setOpen] = useState<{ group: number; fact: number } | null>(
    null,
  );
  const viewer = (
    <AnimatePresence>
      {open && (
        <StoryViewer key="viewer" start={open} onClose={() => setOpen(null)} />
      )}
    </AnimatePresence>
  );
  return { seen: seen.split(","), setOpen, viewer };
}

/** A status ring around an avatar, like a WhatsApp contact with a new status. Opens the first unseen story. */
export function StoryRing({ children }: { children: ReactNode }) {
  const { seen, setOpen, viewer } = useStories();
  const next = STORY_GROUPS.findIndex((group) => !seen.includes(group.id));
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen({ group: Math.max(0, next), fact: 0 })}
        aria-label="עובדות מצחיקות"
        title="עובדות מצחיקות"
        className={styles.view1}
        style={{ background: storyRing(next === -1) }}
      >
        <span className={styles.view2}>
          {children}
        </span>
      </button>
      {viewer}
    </>
  );
}

export function StatusStories() {
  const { seen, setOpen, viewer } = useStories();

  return (
    <section aria-label="עובדות מצחיקות" className={styles.view3}>
      <div className={styles.view4}>
        {STORY_GROUPS.map((group, i) => {
          const isSeen = seen.includes(group.id);
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setOpen({ group: i, fact: 0 })}
              className={styles.view5}
            >
              <span
                className={styles.view6}
                style={{ background: storyRing(isSeen, group.color) }}
              >
                <span
                  className={styles.view7}
                  style={{ background: group.color }}
                >
                  {group.emoji}
                </span>
              </span>
              <span
                className={[styles.view8, isSeen ? styles.view9 : styles.view10, ""].filter(Boolean).join(" ")}
              >
                {group.title}
              </span>
            </button>
          );
        })}
      </div>

      {viewer}
    </section>
  );
}
