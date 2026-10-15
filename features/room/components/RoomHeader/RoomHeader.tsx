"use client";

import styles from "./RoomHeader.module.scss";
import { motion } from "motion/react";
import Link from "next/link";
import { StoryRing } from "@/features/room/components/StatusStories/StatusStories";
import { initial } from "@/core/colors";
import { iso, onlineLabel, pad, splitCountdown } from "@/core/hebrew";
import type { Me, OnlineUser, Typer } from "@/core/hooks/useRoom";
import type { Room } from "@/core/types";

function typingLine(typers: Typer[]) {
  if (typers.length === 1) return `${iso(typers[0].name)} מקליד/ה…`;
  if (typers.length > 1) return `${typers.length} אנשים מקלידים…`;
  return null;
}

function compactClock(room: Room, now: number) {
  if (!now || room.status === "exited") return null;
  const target =
    room.status === "locked" && room.locked_slot
      ? Date.parse(room.locked_slot)
      : Date.parse(room.voting_closes_at);
  if (target <= now) return null;
  const { days, hours, minutes, seconds } = splitCountdown(target - now);
  if (days > 0) return days === 1 ? "עוד יום" : `עוד ${days} ימים`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

type HeaderProps = {
  room: Room;
  now: number;
  me: Me | null;
  /** Opens "your name" (rename, or "not you?"). Not offered to the host. */
  onMe?: () => void;
  online: OnlineUser[];
  typers: Typer[];
  showClock: boolean;
  adminHref: string | null;
  onParty: () => void;
};

/** The chat header: group avatar, name, live subtitle (who you are and who's here). */
export function RoomHeader({
  room,
  now,
  me,
  onMe,
  online,
  typers,
  showClock,
  adminHref,
  onParty,
}: HeaderProps) {
  const typing = typingLine(typers);
  const clock = showClock ? compactClock(room, now) : null;
  const presence = online.length > 0 ? onlineLabel(online.length) : "מתחברים…";

  return (
    <header className={styles.view1}>
      <div className={styles.view2}>
        {/* Like a contact with a status: the ring opens the fun-fact stories. */}
        <StoryRing>
          <span className={styles.view3}>
            {initial(room.group_name)}
          </span>
        </StoryRing>
        <div className={styles.view4}>
          <h1 className={styles.view5}>
            {room.group_name}
          </h1>
          <p
            className={[styles.view6, typing ? styles.view7 : styles.view8, ""].filter(Boolean).join(" ")}
            aria-live="polite"
          >
            {typing ??
              (me ? (
                <>
                  {onMe ? (
                    <button
                      type="button"
                      onClick={onMe}
                      title="שינוי שם"
                      className={styles.view9}
                    >
                      שלום {iso(me.name)}
                    </button>
                  ) : (
                    `שלום ${iso(me.name)}`
                  )}
                  {` · ${presence}`}
                </>
              ) : (
                presence
              ))}
          </p>
        </div>
        {clock && (
          <span
            dir="ltr"
            className={[styles.view10, room.status === "locked" ? styles.view11 : styles.view12, ""].filter(Boolean).join(" ")}
          >
            {clock}
          </span>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 1.3, rotate: -12 }}
          onClick={onParty}
          aria-label="גשם של 🎉 לכל מי שבחדר"
          title="גשם של 🎉 לכל מי שבחדר"
          className={styles.view13}
        >
          🎉
        </motion.button>
        {adminHref && (
          <Link
            href={adminHref}
            aria-label="ניהול החדר (רק את/ה רואה את זה)"
            title="ניהול החדר. רק את/ה רואה את זה, כי פתחת את החדר בדפדפן הזה"
            className={styles.view14}
          >
            <svg
              viewBox="0 0 24 24"
              className={styles.view15}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}
