"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { initial, nameColor } from "@/lib/colors";
import { iso } from "@/lib/hebrew";
import type { Me } from "@/lib/hooks/useRoom";

const SHOW_MS = 4000;

/** Says hello by name as you come in, so you know the room knows (and remembers) you. */
export function Welcome({
  me,
  returning,
}: {
  me: Me | null;
  returning: boolean;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!me) return;
    const timer = setTimeout(() => setHidden(true), SHOW_MS);
    return () => clearTimeout(timer);
  }, [me]);

  return (
    <AnimatePresence>
      {me && !hidden && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -16 }}
          animate={{
            opacity: 1,
            y: 0,
            // Wait for the name prompt to fade out first.
            transition: {
              delay: 0.3,
              type: "spring",
              damping: 20,
              stiffness: 260,
            },
          }}
          exit={{ opacity: 0, y: -16 }}
          className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4.75rem)] z-40 mx-auto flex w-fit max-w-[90%] items-center gap-2.5 rounded-full bg-bubble py-1.5 pe-4 ps-1.5 text-sm text-ink shadow-lg lg:top-28"
        >
          <span
            className="grid size-7 shrink-0 place-items-center rounded-full font-bold text-night"
            style={{ background: nameColor(me.userId) }}
            aria-hidden
          >
            {initial(me.name)}
          </span>
          <span className="min-w-0 truncate">
            {returning
              ? `שלום שוב, ${iso(me.name)} 👋`
              : `שלום ${iso(me.name)} 👋 מעכשיו החדר יזכור אותך`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
