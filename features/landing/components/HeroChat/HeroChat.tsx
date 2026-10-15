"use client";

import styles from "./HeroChat.module.scss";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";
import { Ticks } from "@/components/ui/Ticks/Ticks";
import { iso, pad, splitCountdown } from "@/core/hebrew";
import { useNow } from "@/core/hooks/useNow";
import type { Reason } from "@/core/types";
import type { Draft } from "@/features/landing/types";
import { chatCopy, type ChatLine } from "@/features/landing/content/chatCopy";
import { useLocale } from "@/core/i18n/useLocale";

type Shown = ChatLine & { id: number; time: string };

// Fake clock: the chat starts at 16:02 and each message takes a minute.
function clock(index: number) {
  const minutes = 16 * 60 + 2 + index;
  return `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`;
}

// Each step shows a typing indicator first (for incoming lines), then the line.
const STEP_MS = 1100;

function FakeCountdown() {
  const now = useNow();
  // Counts down to the next 3-hour mark; purely decorative.
  const target = Math.ceil(now / 10_800_000) * 10_800_000;
  const { hours, minutes, seconds } = splitCountdown(target - now);
  return (
    <span dir="ltr" className={styles.view1}>
      {now ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : "--:--:--"}
    </span>
  );
}

export function HeroChat({ theme, draft }: { theme: Reason; draft: Draft }) {
  const locale = useLocale((state) => state.locale);
  const copy = chatCopy(locale);
  // The header previews what's typed in the form.
  const group = draft.groupName.trim() || copy.group;
  const host = draft.hostName.trim() ? iso(draft.hostName.trim()) : copy.me;
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<Shown[]>([]);
  const [queue, setQueue] = useState<ChatLine[]>(() => copy.openers(theme));
  const [count, setCount] = useState(0);
  const [prevTheme, setPrevTheme] = useState(theme);

  // A new reason continues the same chat: drop what hasn't been said yet and
  // queue the correction.
  if (theme !== prevTheme) {
    setPrevTheme(theme);
    setQueue(copy.correction(prevTheme, theme));
  }

  useEffect(() => {
    if (queue.length === 0) return;
    const delay = reduce ? 0 : count === 0 ? 500 : STEP_MS;
    const timer = setTimeout(() => {
      const [next, ...rest] = queue;
      setShown((s) => [...s, { ...next, id: count, time: clock(count) }]);
      setCount(count + 1);
      setQueue(rest);
    }, delay);
    return () => clearTimeout(timer);
  }, [queue, count, reduce]);

  const typing = !reduce && queue[0]?.kind === "in";
  const settled = queue.length === 0 && shown.length > 0;

  // Follow the conversation: jump to the newest message as it arrives.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    el?.scrollTo({
      top: el.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [shown.length, typing, settled, reduce]);

  return (
    <div className={styles.view2}>
      <div className={styles.view3}>
        <div className={styles.view4}>
          🚀
        </div>
        <div className={styles.view5}>
          <div className={styles.view6}>{group}</div>
          <div className={styles.view7}>
            {copy.dana}, {copy.yossi}, {host} {copy.members}
          </div>
        </div>
      </div>

      <motion.div
        ref={scroller}
        layoutScroll
        className={styles.view8}
      >
        <div className={styles.view9}>
          <AnimatePresence initial={false}>
            {shown.map((line) => (
              <motion.div
                key={line.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className={line.kind === "out" ? styles.view10 : styles.view11}
              >
                {line.kind === "in" ? (
                  <div className={styles.view12}>
                    <div
                      className={styles.view13}
                      style={{ color: line.color }}
                    >
                      {line.name}
                    </div>
                    <div className={styles.view14}>{line.text}</div>
                    <div
                      className={styles.view15}
                      dir="ltr"
                    >
                      {line.time}
                    </div>
                  </div>
                ) : (
                  <div className={styles.view16}>
                    <div className={styles.view14}>{line.text}</div>
                    <div
                      className={styles.view17}
                      dir="ltr"
                    >
                      {line.time} <Ticks />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {settled && (
              <motion.div
                key="system"
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className={styles.view18}
              >
                <SystemPill className={styles.view19}>
                  {copy.system} <FakeCountdown />
                </SystemPill>
              </motion.div>
            )}
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.view20}
                aria-hidden
              >
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className={styles.view21}
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: d * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
