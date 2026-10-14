"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { STORY_GROUPS } from "@/lib/content/facts";

const STORY_MS = 6500;
const SEEN_KEY = "exit-stories-seen";

// Seen rings live in localStorage; this tiny store lets React read them without effects.
const seenListeners = new Set<() => void>();
let seenCache: string | null = null;
function readSeen() {
  if (seenCache === null) {
    try {
      seenCache = localStorage.getItem(SEEN_KEY) ?? "";
    } catch {
      seenCache = "";
    }
  }
  return seenCache;
}
function markSeen(id: string) {
  const ids = new Set(readSeen().split(",").filter(Boolean));
  ids.add(id);
  seenCache = [...ids].join(",");
  try {
    localStorage.setItem(SEEN_KEY, seenCache);
  } catch {}
  seenListeners.forEach((l) => l());
}
function subscribeSeen(listener: () => void) {
  seenListeners.add(listener);
  return () => seenListeners.delete(listener);
}

const ring = (seen: boolean, color = "var(--color-signal)") =>
  seen
    ? "var(--color-line)"
    : `conic-gradient(var(--color-signal), ${color}, var(--color-signal))`;

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
        className="grid size-11 shrink-0 place-items-center rounded-full p-[2px] tiny:size-9"
        style={{ background: ring(next === -1) }}
      >
        <span className="grid size-full place-items-center overflow-hidden rounded-full border-2 border-panel">
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
    <section aria-label="עובדות מצחיקות" className="px-1">
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-2 py-2 short:py-1">
        {STORY_GROUPS.map((group, i) => {
          const isSeen = seen.includes(group.id);
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setOpen({ group: i, fact: 0 })}
              className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className="grid size-16 place-items-center rounded-full p-[3px] short:size-14"
                style={{ background: ring(isSeen, group.color) }}
              >
                <span
                  className="grid size-full place-items-center rounded-full border-[3px] border-night text-2xl"
                  style={{ background: group.color }}
                >
                  {group.emoji}
                </span>
              </span>
              <span
                className={`w-full truncate text-center text-xs ${isSeen ? "text-mute" : "text-ink"}`}
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

function StoryViewer({
  start,
  onClose,
}: {
  start: { group: number; fact: number };
  onClose: () => void;
}) {
  const [pos, setPos] = useState(start);
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
      className="fixed inset-0 z-50 flex flex-col bg-night"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="mx-auto flex w-full max-w-md flex-1 flex-col"
        style={{
          background: `linear-gradient(180deg, ${group.color}55, transparent 60%)`,
        }}
      >
        <div className="flex gap-1 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          {group.facts.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/25"
            >
              {i < pos.fact && <div className="h-full w-full bg-ink" />}
              {i === pos.fact && (
                <div ref={barRef} className="h-full w-0 bg-ink" />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span
            className="grid size-10 place-items-center rounded-full text-xl"
            style={{ background: group.color }}
          >
            {group.emoji}
          </span>
          <div className="flex-1">
            <div className="font-semibold">{group.title}</div>
            <div className="text-xs text-ink/60">ידעת?</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="grid size-10 place-items-center rounded-full text-ink/80 hover:bg-ink/10"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
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
          className="relative flex flex-1 select-none items-center px-8"
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
              className="font-display text-[2.75rem] font-bold leading-[1.02] tiny:text-[2rem]"
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
            className="absolute inset-y-0 right-0 w-1/3"
          />
          <button
            type="button"
            aria-label="לעובדה הבאה"
            onClick={() => !consumeLongPress() && next()}
            className="absolute inset-y-0 left-0 w-2/3"
          />
        </div>
        <p className="pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-xs text-ink/50">
          לחיצה ארוכה עוצרת. לחיצה בצד שמאל מעבירה הלאה.
        </p>
      </div>
    </motion.div>
  );
}
