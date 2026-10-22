"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type CSSProperties } from "react";
import type { Player } from "@/features/room/types/room.types";
import { initialOf, senderColor } from "@/shared/utils/avatar";
import { isolate } from "@/shared/utils/isolate";
import { welcomeClasses } from "./Welcome.classes";
import { WELCOME_SHOW_MS } from "./Welcome.const";
import { WELCOME_NAMESPACE, welcomeKeys } from "./Welcome.keys.const";

/**
 * Says hello by name as you come in, so you know the room knows — and remembers — you. Key it by
 * the user, so whoever comes in after "not you?" gets their own hello.
 */
export function Welcome({ me, isReturning }: { me: Player | null; isReturning: boolean }) {
  const t = useTranslations(WELCOME_NAMESPACE);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!me) return;
    const timer = setTimeout(() => setIsHidden(true), WELCOME_SHOW_MS);
    return () => clearTimeout(timer);
  }, [me]);

  return (
    <AnimatePresence>
      {me && !isHidden && (
        <motion.div
          role="status"
          className={welcomeClasses.root}
          initial={{ opacity: 0, y: -16 }}
          // Waits for the join gate to fade first.
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3, type: "spring", damping: 20 } }}
          exit={{ opacity: 0, y: -16 }}
        >
          <span
            className={welcomeClasses.avatar}
            style={{ "--avatar-color": senderColor(me.userId) } as CSSProperties}
            aria-hidden
          >
            {initialOf(me.name)}
          </span>
          <span className={welcomeClasses.text}>
            {t(welcomeKeys.hello, { returning: String(isReturning), name: isolate(me.name) })}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
