"use client";

import styles from "./GameRecordLine.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { GAME_META } from "@/core/games";
import type { GameId, LeaderboardRow } from "@/core/types";

/** The room's record for a game, under its title while playing (like a chat's subtitle). Pops when the record changes. */
export function RecordLine({
  game,
  top,
  myUserId,
}: {
  game: GameId;
  top: LeaderboardRow | undefined;
  myUserId: string | null;
}) {
  const mine = !!top && top.user_id === myUserId;
  return (
    <div aria-live="polite" className={styles.view1}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={top ? `${top.user_id}:${top.score}` : "none"}
          initial={{ opacity: 0, y: -12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", damping: 18, stiffness: 320 }}
          className={styles.view2}
        >
          <span aria-hidden>👑</span>
          {top ? (
            <>
              <span className={styles.view3}>
                {mine ? "השיא שלך" : "השיא:"}
              </span>
              {!mine && (
                <bdi className={styles.view4}>
                  {top.display_name}
                </bdi>
              )}
              <span className={styles.view5}>
                {GAME_META[game].format(top.score)}
              </span>
            </>
          ) : (
            <span className={styles.view6}>
              עוד אין שיא בחדר. תהיו הראשונים
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
