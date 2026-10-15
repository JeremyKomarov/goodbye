"use client";

import styles from "./Welcome.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { initial, nameColor } from "@/core/colors";
import { iso } from "@/core/hebrew";
import type { Me } from "@/core/hooks/useRoom";

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
          className={styles.view1}
        >
          <span
            className={styles.view2}
            style={{ background: nameColor(me.userId) }}
            aria-hidden
          >
            {initial(me.name)}
          </span>
          <span className={styles.view3}>
            {returning
              ? `שלום שוב, ${iso(me.name)} 👋`
              : `שלום ${iso(me.name)} 👋 מעכשיו החדר יזכור אותך`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
