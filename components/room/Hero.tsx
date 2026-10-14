"use client";

import { motion } from "motion/react";
import { FlipDigits } from "@/components/room/FlipDigits";
import { SystemPill } from "@/components/ui/SystemPill";
import { formatDuration, formatDurationRough, formatSlot, g, iso, pad, REASONS, splitCountdown, votesLabel } from "@/lib/hebrew";
import { leftLine, verdict } from "@/lib/room-view";
import { type Lead, wonByDraw } from "@/lib/slots";
import type { Room } from "@/lib/types";

type Props = {
  room: Room;
  now: number;
  leader: Lead | null;
  voterCount: number;
  onReplayFinale: () => void;
  /** Phones: the hero shares the screen with the vote grid, so it stays small. */
  compact?: boolean;
};

const SIZES = {
  roomy: {
    section: "py-4 short:pb-3 short:pt-2",
    pill: "",
    label: "text-lg",
    afterPill: "mt-5 short:mt-3",
    days: "text-lg",
    digits: "text-[5.5rem] short:text-[4rem]",
    note: "mt-3 text-balance short:mt-2",
    exitRow: "mt-5 short:mt-3",
    exited: "pt-8",
    verdict: "text-6xl",
  },
  compact: {
    section: "pb-1 pt-3 short:pt-1 tiny:py-0",
    pill: "short:hidden",
    label: "",
    afterPill: "mt-3 short:mt-0",
    days: "text-base",
    digits:
      "text-[min(5rem,19vw)] short:text-[min(4rem,16vw)] tiny:text-[3.25rem]",
    note: "mt-2 text-balance text-sm",
    exitRow: "mt-3 tiny:mt-2",
    exited: "pt-3",
    verdict: "text-5xl short:text-4xl",
  },
};

function clock(ms: number) {
  const { days, hours, minutes, seconds } = splitCountdown(ms);
  return { days, text: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` };
}

function DaysLine({ days, className }: { days: number; className: string }) {
  if (days === 0) return null;
  return (
    <div className={`mb-1 text-ink/80 ${className}`}>
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
  compact = false,
}: Props) {
  const size = compact ? SIZES.compact : SIZES.roomy;
  const tz = room.timezone;
  const he = room.host_gender;
  const name = iso(room.host_name);
  const reason = room.reason ? REASONS[room.reason][he] : null;

  if (room.status === "exited") {
    const v = verdict(room);
    return (
      <section className={`px-4 pb-4 text-center ${size.exited}`}>
        <SystemPill className="text-base">{leftLine(room)}</SystemPill>
        {v && (
          <p className={`mt-4 font-display font-bold leading-none ${size.verdict}`}>
            {v.kind === "on_time"
              ? "בדיוק בזמן"
              : v.kind === "late"
                ? `${g(he, "איחר", "איחרה")} ב-${formatDurationRough(v.diffMs)}`
                : `${g(he, "ברח", "ברחה")} ${formatDurationRough(v.diffMs)} מוקדם`}
          </p>
        )}
        <button
          type="button"
          onClick={onReplayFinale}
          className="mt-4 rounded-full bg-raised px-5 py-2.5 text-sm"
        >
          לצפייה בסיום שוב
        </button>
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
      <section className={`px-4 text-center ${size.section}`}>
        <p className={`text-ink/85 ${size.label}`}>
          {overtime
            ? "הזמן עבר לפני"
            : `${name} ${g(he, "יוצא", "יוצאת")} מהקבוצה בעוד`}
        </p>
        <div className="mt-2 short:mt-1">
          <DaysLine days={days} className={size.days} />
          <FlipDigits
            value={now ? text : "--:--:--"}
            className={`${size.digits} ${overtime ? "text-pill" : "text-exit"}`}
          />
          <span className="sr-only">{formatDuration(Math.abs(remaining))}</span>
        </div>
        <p className={`text-ink/75 ${size.note}`}>
          {overtime
            ? `${name}, הכפתור מחכה לך 👀`
            : wonByDraw(leader, room.locked_slot)
              ? `${formatSlot(target, tz)}. היה תיקו בין ${leader!.tied.length} שעות, וההגרלה בחרה בזו 🎲`
              : `${formatSlot(target, tz)}. ככה החליטה הקבוצה${leader ? `, עם ${votesLabel(leader.count)}` : ""}.`}
        </p>

        {/* WhatsApp's red "Exit group" row from the group info screen, filling up as the hour nears. */}
        <div
          className={`relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-raised/60 text-start ${size.exitRow}`}
        >
          <motion.div
            className="absolute inset-y-0 start-0 bg-exit/20"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear", duration: 0.25 }}
          />
          <div className="relative flex items-center gap-4 px-5 py-4 text-exit short:py-3">
            <svg
              viewBox="0 0 24 24"
              className="size-6 -scale-x-100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="font-medium">יציאה מהקבוצה</span>
            <span className="ms-auto text-sm tabular-nums text-exit/80">
              {Math.floor(progress * 100)}%
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Voting (also the brief moment after closing, before the database locks the slot).
  const remaining = closes - now;
  const counting = now > 0 && remaining <= 0;
  const { days, text } = clock(remaining);

  return (
    <section className={`px-4 text-center ${size.section}`}>
      <SystemPill className={size.pill}>
        {reason ? `${name} ${reason}. ` : ""}
        {`עכשיו הקבוצה מחליטה מתי ${g(he, "הוא יוצא", "היא יוצאת")} מ${iso(room.group_name)}.`}
      </SystemPill>
      <p className={`text-ink/85 ${size.label} ${size.afterPill}`}>
        {counting ? "סופרים קולות…" : "ההצבעה נסגרת בעוד"}
      </p>
      <div className="mt-2 short:mt-1">
        <DaysLine days={days} className={size.days} />
        <FlipDigits
          value={now ? text : "--:--:--"}
          className={`${size.digits} text-ink`}
        />
        <span className="sr-only">{formatDuration(remaining)}</span>
      </div>
      {leader && leader.tied.length > 1 ? (
        <div className={size.note}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pill/15 px-3 py-1 text-sm font-semibold text-pill">
            <span aria-hidden>⚖️</span> תיקו בין {leader.tied.length} שעות
          </span>
          <p className="mt-1.5 text-ink/75">
            {leader.tied
              .slice(0, 3)
              .map((ms) => formatSlot(ms, tz))
              .join(", ")}
            {leader.tied.length > 3 ? ` ועוד ${leader.tied.length - 3}` : ""}
            {`, עם ${votesLabel(leader.count)} כל אחת. ${counting ? "ההגרלה מכריעה…" : "אם זה יישאר ככה, הגרלה תכריע."}`}
          </p>
        </div>
      ) : (
        <p className={`text-ink/75 ${size.note}`}>
          {leader
            ? `מובילה כרגע: ${formatSlot(leader.ms, tz)}, עם ${votesLabel(leader.count)} מתוך ${voterCount}.`
            : "עוד אף אחד לא הצביע. בחרו שעה בטבלה."}
        </p>
      )}
    </section>
  );
}
