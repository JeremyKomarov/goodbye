"use client";

import { AnimatePresence, motion } from "motion/react";

/** Big countdown digits; each character rolls when it changes. Always LTR. */
export function FlipDigits({ value, className = "" }: { value: string; className?: string }) {
  return (
    <div dir="ltr" className={`flex justify-center font-display font-bold leading-none ${className}`} aria-hidden>
      {Array.from(value).map((char, i) =>
        char === ":" ? (
          <span key={i} className="w-[0.28em] text-center opacity-50">
            :
          </span>
        ) : (
          <span key={i} className="relative inline-block h-[1em] w-[0.5em] overflow-hidden text-center">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={char}
                className="absolute inset-0"
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
