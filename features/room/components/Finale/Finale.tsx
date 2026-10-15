"use client";

import styles from "./Finale.module.scss";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";
import { GAME_META, rankRows } from "@/core/games";
import { formatHour, formatSlot, g } from "@/core/hebrew";
import { leftLine, verdictText } from "@/core/room-view";
import { mostLoved, type ReactionMap } from "@/core/reactions";
import type { GameId, LeaderboardRow, Room, WallMessage } from "@/core/types";

type Props = {
  room: Room;
  drawn: boolean;
  /** The hour that was ahead when the host left mid-vote (no hour was locked). */
  leadingMs: number | null;
  voterCount: number;
  messages: WallMessage[];
  reactions: ReactionMap;
  leaderboard: LeaderboardRow[];
  onClose: () => void;
};

const COLORS = ["#f15c6d", "#ffd279", "#c9a46a", "#25d366", "#53bdeb"];

export function Finale({
  room,
  drawn,
  leadingMs,
  voterCount,
  messages,
  reactions,
  leaderboard,
  onClose,
}: Props) {
  const reduce = useReducedMotion();
  const he = room.host_gender;
  const tz = room.timezone;

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.35 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
      setTimeout(
        () =>
          !cancelled &&
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.6 },
            colors: COLORS,
          }),
        350,
      );
      setTimeout(
        () =>
          !cancelled &&
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.6 },
            colors: COLORS,
          }),
        550,
      );
    }, 900);
    navigator.vibrate?.([40, 60, 120]);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduce]);

  const headline = verdictText(room) ?? "זהו, נגמר";

  const loved = mostLoved(messages, reactions);
  const champions = (Object.keys(GAME_META) as GameId[])
    .map((game) => ({ game, top: rankRows(leaderboard, game)[0] }))
    .filter((c) => c.top);

  const stats = [
    room.locked_slot && {
      label: drawn ? "השעה שנבחרה (בהגרלה)" : "השעה שנבחרה",
      value: formatSlot(Date.parse(room.locked_slot), tz),
    },
    !room.locked_slot &&
      leadingMs !== null && {
        label: "הובילה בהצבעה",
        value: formatSlot(leadingMs, tz),
      },
    room.exited_at && {
      label: g(he, "יצא בפועל", "יצאה בפועל"),
      value: formatHour(Date.parse(room.exited_at), tz),
    },
    { label: "הצביעו", value: voterCount.toLocaleString("he-IL") },
    { label: "הודעות פרידה", value: messages.length.toLocaleString("he-IL") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={leftLine(room)}
      className={styles.view1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.view2}>
        <motion.div
          className={styles.view3}
          initial={{ y: -80, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: [0.6, 1.25, 1] }}
          transition={{ duration: 0.7, times: [0, 0.6, 1], delay: 0.3 }}
        >
          <SystemPill className={styles.view4}>
            {leftLine(room)}
          </SystemPill>
        </motion.div>

        <motion.h2
          className={styles.view5}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: "spring", damping: 16 }}
        >
          {headline}
        </motion.h2>

        <motion.dl
          className={styles.view6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {stats.map((s) => (
            <div key={s.label} className={styles.view7}>
              <dt className={styles.view8}>{s.label}</dt>
              <dd className={styles.view9}>{s.value}</dd>
            </div>
          ))}
        </motion.dl>

        {loved && (
          <motion.figure
            className={styles.view10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <figcaption className={styles.view8}>
              ❤️ ההודעה הכי אהובה ·{" "}
              {loved.count === 1 ? "תגובה אחת" : `${loved.count} תגובות`}
            </figcaption>
            <blockquote dir="auto" className={styles.view11}>
              {loved.message.body}
            </blockquote>
            <div className={styles.view12}>
              <bdi>{loved.message.display_name}</bdi>
            </div>
          </motion.figure>
        )}

        {champions.length > 0 && (
          <motion.div
            className={styles.view13}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <h3 className={styles.view14}>האלופים</h3>
            <ul className={styles.view15}>
              {champions.map(({ game, top }) => (
                <li
                  key={game}
                  className={styles.view16}
                >
                  <span className={styles.view17}>{GAME_META[game].title}</span>
                  <span className={styles.view18}>
                    <bdi>{top!.display_name}</bdi>, {GAME_META[game].format(top!.score)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.button
          type="button"
          onClick={onClose}
          className={styles.view19}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
        >
          חזרה לחדר
        </motion.button>
      </div>
    </motion.div>
  );
}
