"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/shared/utils/cn";
import { flipDigitsClasses } from "./FlipDigits.classes";

/**
 * A countdown's big digits: each character rolls in as it changes. Always left to right, and
 * decorative — the caller says the time in words for screen readers.
 */
export function FlipDigits({ value, className }: { value: string; className?: string }) {
  return (
    <div dir="ltr" className={cn(flipDigitsClasses.root, className)} aria-hidden>
      {Array.from(value).map((char, index) =>
        char === ":" ? (
          <span key={index} className={flipDigitsClasses.colon}>
            :
          </span>
        ) : (
          <span key={index} className={flipDigitsClasses.slot}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={char}
                className={flipDigitsClasses.digit}
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
