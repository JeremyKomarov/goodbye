"use client";

import styles from "./FlipDigits.module.scss";
import { AnimatePresence, motion } from "motion/react";

/** Big countdown digits; each character rolls when it changes. Always LTR. */
export function FlipDigits({ value, className = "" }: { value: string; className?: string }) {
  return (
    <div dir="ltr" className={[styles.view1, className, ""].filter(Boolean).join(" ")} aria-hidden>
      {Array.from(value).map((char, i) =>
        char === ":" ? (
          <span key={i} className={styles.view2}>
            :
          </span>
        ) : (
          <span key={i} className={styles.view3}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={char}
                className={styles.view4}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 260 }}
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        ),
      )}
    </div>
  );
}
