"use client";

import styles from "./Hero.module.scss";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { FlipDigits } from "@/features/room/components/FlipDigits/FlipDigits";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";
import { formatDuration, formatSlot, g, iso, pad, REASONS, splitCountdown, votesLabel } from "@/core/hebrew";
import { leftLine, verdictText } from "@/core/room-view";
import { type Lead, wonByDraw } from "@/core/slots";
import type { Room } from "@/core/types";

type Props = {
  room: Room;
  now: number;
  leader: Lead | null;
  voterCount: number;
  onReplayFinale: () => void;
  /** Shown under the countdown once the hour is locked (calendar, sharing), and to the host after the exit. */
  actions?: ReactNode;
  /** The host only: the red "exit group" row becomes their button for marking the exit. */
  onExit?: () => void;
  exiting?: boolean;
  /** Phones: the hero shares the screen with the vote grid, so it stays small. */
  compact?: boolean;
};

const SIZES = {
  roomy: {
    section: styles.roomySection,
    pill: "",
    label: styles.roomyText,
    afterPill: styles.roomyAfterPill,
    days: styles.roomyText,
    digits: styles.roomyDigits,
    note: styles.roomyNote,
    exitRow: styles.roomyExitRow,
    exited: styles.roomyExited,
    verdict: styles.roomyVerdict,
  },
  compact: {
    section: styles.compactSection,
    pill: styles.compactPill,
    label: "",
    afterPill: styles.compactAfterPill,
    days: styles.compactDays,
    digits: styles.compactDigits,
    note: styles.compactNote,
    exitRow: styles.compactExitRow,
    exited: styles.compactExited,
    verdict: styles.compactVerdict,
  },
};

function clock(ms: number) {
  const { days, hours, minutes, seconds } = splitCountdown(ms);
  return { days, text: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` };
}

function DaysLine({ days, className }: { days: number; className: string }) {
  if (days === 0) return null;
  return (
    <div className={[styles.view1, className, ""].filter(Boolean).join(" ")}>
      {days === 1 ? "יום אחד ו-" : days === 2 ? "יומיים ו-" : `${days} ימים ו-`}
    </div>
  );
}

export function Hero({
  room,
  now,
  leader,
  voterCount,
  onReplayFinale,
  actions,
  onExit,
  exiting = false,
  compact = false,
}: Props) {
  const size = compact ? SIZES.compact : SIZES.roomy;
  const tz = room.timezone;
  const he = room.host_gender;
  const name = iso(room.host_name);
  const reason = room.reason ? REASONS[room.reason][he] : null;

  if (room.status === "exited") {
    const verdictLine = verdictText(room);
    return (
      <section className={[styles.view2, size.exited, ""].filter(Boolean).join(" ")}>
        <SystemPill className={styles.view3}>{leftLine(room)}</SystemPill>
        {verdictLine && (
          <p className={[styles.view4, size.verdict, ""].filter(Boolean).join(" ")}>
            {verdictLine}
          </p>
        )}
        <button
          type="button"
          onClick={onReplayFinale}
          className={styles.view5}
        >
          לצפייה בסיום שוב
        </button>
        {actions}
      </section>
    );
  }

  const closes = Date.parse(room.voting_closes_at);

  if (room.status === "locked" && room.locked_slot) {
    const target = Date.parse(room.locked_slot);
    const remaining = target - now;
    const overtime = now > 0 && remaining < 0;
    const { days, text } = clock(Math.abs(remaining));
    const progress = now
      ? Math.min(1, Math.max(0, (now - closes) / Math.max(1, target - closes)))
      : 0;

    return (
      <section className={[styles.view6, size.section, ""].filter(Boolean).join(" ")}>
        <p className={[styles.view7, size.label, ""].filter(Boolean).join(" ")}>
          {overtime
            ? "הגיע הזמן! עברו כבר"
            : `${name} ${g(he, "יוצא", "יוצאת")} מהקבוצה בעוד`}
        </p>
        <div className={styles.view8}>
          <DaysLine days={days} className={size.days} />
          <FlipDigits
            value={now ? text : "--:--:--"}
            className={["", size.digits, "", overtime ? styles.view9 : styles.view10, ""].filter(Boolean).join(" ")}
          />
          <span className={styles.view11}>{formatDuration(Math.abs(remaining))}</span>
        </div>
        <p className={[styles.view12, size.note, ""].filter(Boolean).join(" ")}>
          {overtime
            ? onExit
              ? "יוצאים מהקבוצה בוואטסאפ, ואז לוחצים כאן 👇"
              : `עכשיו רק מחכים ש${name} ${g(he, "יצא", "תצא")} 👀`
            : wonByDraw(leader, room.locked_slot)
              ? `${formatSlot(target, tz)}. היה תיקו בין ${leader!.tied.length} שעות, וההגרלה בחרה בזו 🎲`
              : `${formatSlot(target, tz)}. ככה החליטה הקבוצה${leader ? `, עם ${votesLabel(leader.count)}` : ""}.`}
        </p>

        {/* WhatsApp's red "Exit group" row from the group info screen, filling up as the hour nears.
            For the host it's the real thing: tapping it marks the exit. */}
        <motion.div
          role={onExit ? "button" : undefined}
          tabIndex={onExit ? 0 : undefined}
          aria-disabled={onExit ? exiting : undefined}
          aria-label={onExit ? "יציאה מהקבוצה: לסמן שיצאת" : undefined}
          onClick={onExit && !exiting ? onExit : undefined}
          onKeyDown={
            onExit
              ? (e) => {
                  if (exiting || (e.key !== "Enter" && e.key !== " ")) return;
                  e.preventDefault();
                  onExit();
                }
              : undefined
          }
          whileTap={onExit && !exiting ? { scale: 0.97 } : undefined}
          className={[styles.view13, size.exitRow, "", onExit ? [styles.view14, overtime ? styles.view15 : "", "", exiting ? styles.view16 : "", ""].filter(Boolean).join(" ") : "", ""].filter(Boolean).join(" ")}
        >
          <motion.div
            className={styles.view17}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear", duration: 0.25 }}
          />
          <div className={styles.view18}>
            <svg
              viewBox="0 0 24 24"
              className={styles.view19}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className={styles.view20}>יציאה מהקבוצה</span>
            <span className={styles.view21}>
              {exiting
                ? "רגע…"
                : onExit && overtime
                  ? "לחיצה כאן"
                  : `${Math.floor(progress * 100)}%`}
            </span>
          </div>
        </motion.div>
        {actions}
      </section>
    );
  }

  // Voting (also the brief moment after closing, before the database locks the slot).
  const remaining = closes - now;
  const counting = now > 0 && remaining <= 0;
  const { days, text } = clock(remaining);

  return (
    <section className={[styles.view6, size.section, ""].filter(Boolean).join(" ")}>
      <SystemPill className={size.pill}>
        {reason ? `${name} ${reason}. ` : ""}
        {`עכשיו הקבוצה מחליטה מתי ${g(he, "הוא יוצא", "היא יוצאת")} מ${iso(room.group_name)}.`}
      </SystemPill>
      <p className={[styles.view7, size.label, "", size.afterPill, ""].filter(Boolean).join(" ")}>
        {counting ? "סופרים קולות…" : "ההצבעה נסגרת בעוד"}
      </p>
      <div className={styles.view8}>
        <DaysLine days={days} className={size.days} />
        <FlipDigits
          value={now ? text : "--:--:--"}
          className={["", size.digits, styles.view22].filter(Boolean).join(" ")}
        />
        <span className={styles.view11}>{formatDuration(remaining)}</span>
      </div>
      {leader && leader.tied.length > 1 ? (
        <div className={size.note}>
          <span className={styles.view23}>
            <span aria-hidden>⚖️</span> תיקו בין {leader.tied.length} שעות
          </span>
          <p className={styles.view24}>
            {leader.tied
              .slice(0, 3)
              .map((ms) => formatSlot(ms, tz))
              .join(", ")}
            {leader.tied.length > 3 ? ` ועוד ${leader.tied.length - 3}` : ""}
            {`, עם ${votesLabel(leader.count)} כל אחת. ${counting ? "ההגרלה מכריעה…" : "אם זה יישאר ככה, הגרלה תכריע."}`}
          </p>
        </div>
      ) : (
        <p className={[styles.view12, size.note, ""].filter(Boolean).join(" ")}>
          {leader
            ? `מובילה כרגע: ${formatSlot(leader.ms, tz)}, עם ${votesLabel(leader.count)} מתוך ${voterCount}.`
            : "עוד אף אחד לא הצביע. בחרו שעה בטבלה."}
        </p>
      )}
    </section>
  );
}
