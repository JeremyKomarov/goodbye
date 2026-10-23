"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { GameId } from "@/core/constants/games.const";
import { useGameWords } from "@/shared/hooks/useGameWords";
import type { GameRecord } from "@/shared/types/records.types";
import { recordLineClasses } from "./RecordLine.classes";
import { RECORD_LINE_NAMESPACE, recordLineKeys } from "./RecordLine.keys.const";

interface RecordLineProps {
  game: GameId;
  /** The game's best score in the room, if anyone has played. */
  top: GameRecord | undefined;
  meId: string | null;
}

/** The room's record for a game, read out when it changes; a new one pops in. */
export function RecordLine({ game, top, meId }: RecordLineProps) {
  const t = useTranslations(RECORD_LINE_NAMESPACE);
  const words = useGameWords();
  const isMine = !!top && top.userId === meId;

  return (
    <div className={recordLineClasses.root} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={top ? `${top.userId}:${top.score}` : "none"}
          className={recordLineClasses.line}
          initial={{ opacity: 0, y: -12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", damping: 18, stiffness: 320 }}
        >
          <span aria-hidden>👑</span>
          {top ? (
            <>
              <span className={recordLineClasses.label}>
                {t(isMine ? recordLineKeys.mine : recordLineKeys.theirs)}
              </span>
              {!isMine && <bdi className={recordLineClasses.name}>{top.name}</bdi>}
              <span className={recordLineClasses.score}>{words.score(game, top.score)}</span>
            </>
          ) : (
            <span className={recordLineClasses.label}>{t(recordLineKeys.none)}</span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
