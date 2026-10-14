"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { GAME_META, rankRows } from "@/components/room/Leaderboard";
import { SystemPill } from "@/components/ui/SystemPill";
import { formatDurationRough, formatHour, formatSlot, g } from "@/lib/hebrew";
import { leftLine, verdict } from "@/lib/room-view";
import type { GameId, LeaderboardRow, Room } from "@/lib/types";

type Props = {
  room: Room;
  drawn: boolean;
  voterCount: number;
  messageCount: number;
  leaderboard: LeaderboardRow[];
  onClose: () => void;
};

const COLORS = ["#f15c6d", "#ffd279", "#c9a46a", "#25d366", "#53bdeb"];

export function Finale({
  room,
  drawn,
  voterCount,
  messageCount,
  leaderboard,
  onClose,
}: Props) {
  const reduce = useReducedMotion();
  const v = verdict(room);
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

  const headline = !v
    ? "זהו, נגמר"
    : v.kind === "on_time"
      ? "בדיוק בזמן"
      : v.kind === "late"
        ? `${g(he, "איחר", "איחרה")} ב-${formatDurationRough(v.diffMs)}`
        : `${g(he, "ברח", "ברחה")} ${formatDurationRough(v.diffMs)} מוקדם`;

  const champions = (Object.keys(GAME_META) as GameId[])
    .map((game) => ({ game, top: rankRows(leaderboard, game)[0] }))
    .filter((c) => c.top);

  const stats = [
    room.locked_slot && {
      label: drawn ? "השעה שנבחרה (בהגרלה)" : "השעה שנבחרה",
      value: formatSlot(Date.parse(room.locked_slot), tz),
    },
    room.exited_at && {
      label: g(he, "יצא בפועל", "יצאה בפועל"),
      value: formatHour(Date.parse(room.exited_at), tz),
    },
    { label: "הצביעו", value: voterCount.toLocaleString("he-IL") },
    { label: "הודעות פרידה", value: messageCount.toLocaleString("he-IL") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={leftLine(room)}
      className="fixed inset-0 z-50 overflow-y-auto bg-night/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-7 px-6 py-12 text-center short:gap-4 short:py-6">
        <motion.div
          className="w-full"
          initial={{ y: -80, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: [0.6, 1.25, 1] }}
          transition={{ duration: 0.7, times: [0, 0.6, 1], delay: 0.3 }}
        >
          <SystemPill className="px-5 py-2.5 text-lg">
            {leftLine(room)}
          </SystemPill>
        </motion.div>

        <motion.h2
          className="font-display text-[min(5.5rem,20vw)] font-bold short:text-[3.5rem] lg:text-[6.5rem] leading-[0.85]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: "spring", damping: 16 }}
        >
          {headline}
        </motion.h2>

        <motion.dl
          className="grid w-full grid-cols-2 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-panel px-3 py-3">
              <dt className="text-xs text-mute">{s.label}</dt>
              <dd className="mt-0.5 font-semibold">{s.value}</dd>
            </div>
          ))}
        </motion.dl>

        {champions.length > 0 && (
          <motion.div
            className="w-full short:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <h3 className="mb-2 text-sm text-mute">האלופים</h3>
            <ul className="flex flex-col gap-1.5">
              {champions.map(({ game, top }) => (
                <li
                  key={game}
                  className="flex items-center justify-between rounded-xl bg-panel px-4 py-2.5 text-sm"
                >
                  <span className="text-mute">{GAME_META[game].title}</span>
                  <span className="font-semibold">
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
          className="w-full rounded-2xl bg-raised px-6 py-4 font-semibold"
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
