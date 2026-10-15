"use client";

import styles from "./VoteHeatmap.module.scss";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ticks } from "@/components/ui/Ticks/Ticks";
import {
  formatDayMonth,
  formatSlot,
  formatWeekday,
  g,
  iso,
  pad,
  votesLabel,
} from "@/core/hebrew";
import { buildSlotDays } from "@/core/slots";
import { columns, DARK_TEXT_FROM, RAMP, step } from "@/features/room/content/voteScale";
import { VoteLegend } from "@/features/room/components/VoteLegend/VoteLegend";
import type { Room, Vote } from "@/core/types";

type Props = {
  room: Room;
  now: number;
  tally: Map<number, Vote[]>;
  players: Record<string, string>;
  myUserId: string | null;
  mySlot: number | null;
  onVote: (slotMs: number | null) => Promise<string | null>;
  /** False for the host: the group picks when they leave, so they only watch. */
  canVote?: boolean;
  className?: string;
};

/**
 * Pick a day, then an hour. Hours are chips tinted by how many votes they have, so
 * the popular ones stand out; each day in the strip shows its total.
 */
export function VoteHeatmap({
  room,
  now,
  tally,
  players,
  myUserId,
  mySlot,
  onVote,
  canVote = true,
  className = "",
}: Props) {
  const days = useMemo(() => buildSlotDays(room), [room]);
  const [picked, setPicked] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hoursRef = useRef<HTMLDivElement>(null);

  const tz = room.timezone;
  const closes = Date.parse(room.voting_closes_at);
  const open = room.status === "voting" && (now === 0 || now < closes);
  const winner = room.locked_slot ? Date.parse(room.locked_slot) : null;
  const max = Math.max(0, ...[...tally.values()].map((v) => v.length));
  const hourCount = room.day_end_hour - room.day_start_hour;

  // Until you pick a day: the one with your vote, else the chosen hour, else the first you can still vote on.
  const anchor = mySlot ?? winner;
  const anchorDay = Math.max(
    0,
    days.findIndex((day) =>
      day.slots.some(
        (s) => s && (anchor !== null ? s.ms === anchor : s.ms >= closes),
      ),
    ),
  );
  const dayIndex = Math.min(picked ?? anchorDay, days.length - 1);
  const day = days[dayIndex];
  // Short screens put a day's name and date on one line, when there's room across.
  const oneLine = days.length <= 4;
  const dayName = (ms: number) =>
    `${formatWeekday(ms, tz)} ${formatDayMonth(ms, tz)}`;

  // If the hours ever need to scroll (24-hour days on a small phone), keep the anchor in view.
  useEffect(() => {
    const box = hoursRef.current;
    const chip = box?.querySelector<HTMLElement>(`[data-ms="${anchor}"]`);
    if (!box || !chip) return;
    const top = chip.offsetTop;
    if (
      top < box.scrollTop ||
      top + chip.offsetHeight > box.scrollTop + box.clientHeight
    )
      box.scrollTop = top - (box.clientHeight - chip.offsetHeight) / 2;
  }, [anchor, dayIndex]);

  async function cast(ms: number) {
    setError(null);
    navigator.vibrate?.(10);
    const err = await onVote(mySlot === ms ? null : ms);
    if (err) setError(err);
  }

  const detailMs = focused ?? mySlot ?? winner;
  const detailVoters = detailMs !== null ? (tally.get(detailMs) ?? []) : [];
  const detailNames = detailVoters.map((v) =>
    v.user_id === myUserId ? "את/ה" : (players[v.user_id] ?? "מישהו"),
  );
  const showingMine =
    detailMs !== null && detailMs === mySlot && focused === null;

  // Narrow cards get 4–5 columns (5–6 for long days); wide cards and landscape phones fit a day in two or three rows.
  const dense = hourCount > 16;
  const gridVars = {
    "--cols": columns(hourCount, dense ? 5 : 4, dense ? 6 : 5),
    "--cols-wide": columns(hourCount, 5, 8),
    gridAutoRows: "minmax(var(--row-min), 3.5rem)",
  } as React.CSSProperties;

  return (
    <section
      aria-labelledby="vote-title"
      className={[styles.view1, className, ""].filter(Boolean).join(" ")}
    >
      <div className={styles.view2}>
        <h2 id="vote-title" className={styles.view3}>
          {open ? "באיזו שעה לצאת?" : "התוצאות"}
        </h2>
        <span className={styles.view4}>
          {days.length === 1
            ? dayName(day.ms)
            : open
              ? canVote
                ? "בוחרים יום ושעה"
                : "הקבוצה מחליטה"
              : "ההצבעה סגורה"}
        </span>
      </div>

      {days.length > 1 && (
        <div
          role="group"
          aria-label="ימים"
          className={styles.view5}
        >
          {days.map((d, i) => {
            const selected = i === dayIndex;
            const votes = d.slots.reduce(
              (n, s) => n + (s ? (tally.get(s.ms)?.length ?? 0) : 0),
              0,
            );
            const hasMine = d.slots.some((s) => s && s.ms === mySlot);
            const hasWinner = d.slots.some((s) => s && s.ms === winner);
            return (
              <button
                key={d.key}
                type="button"
                aria-pressed={selected}
                aria-label={`${dayName(d.ms)}, ${votes ? votesLabel(votes) : "אין קולות"}${hasMine ? ", הקול שלך" : ""}${hasWinner ? ", היום שנבחר" : ""}`}
                onClick={() => setPicked(i)}
                className={[styles.view6, oneLine ? styles.view7 : "", "", selected ? styles.view8 : styles.view9, "", hasWinner ? styles.view10 : "", ""].filter(Boolean).join(" ")}
              >
                <span className={styles.view11}>
                  {formatWeekday(d.ms, tz).replace("יום ", "")}
                  {hasMine && <Ticks className={styles.view12} />}
                </span>
                <span
                  className={[styles.view13, selected ? styles.view14 : styles.view15, ""].filter(Boolean).join(" ")}
                  dir="ltr"
                >
                  {formatDayMonth(d.ms, tz)}
                </span>
                {votes > 0 && (
                  <span className={styles.view16}>
                    {votes}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Padding keeps the rings on edge chips from being clipped if this ever scrolls. */}
      <div
        ref={hoursRef}
        role="group"
        aria-label={`השעות של ${dayName(day.ms)}`}
        className={[styles.view17, dense ? styles.view18 : styles.view19, styles.view20].filter(Boolean).join(" ")}
        style={gridVars}
      >
        {day.slots.map((slot) => {
          if (!slot) return null;
          const count = tally.get(slot.ms)?.length ?? 0;
          const s = step(count, max);
          const mine = mySlot === slot.ms;
          const isWinner = winner === slot.ms;
          const past = slot.ms < closes;
          const disabled = !open || !canVote || past;
          return (
            <motion.button
              key={slot.ms}
              type="button"
              data-ms={slot.ms}
              aria-label={`${formatSlot(slot.ms, tz)}, ${count ? votesLabel(count) : "אין קולות"}${mine ? ", הקול שלך" : ""}${isWinner ? ", השעה שנבחרה" : ""}`}
              aria-pressed={mine}
              disabled={disabled}
              onClick={() => cast(slot.ms)}
              onPointerEnter={() => setFocused(slot.ms)}
              onPointerLeave={() => setFocused(null)}
              onFocus={() => setFocused(slot.ms)}
              onBlur={() => setFocused(null)}
              whileTap={disabled ? undefined : { scale: 0.9 }}
              className={[styles.view21, open && past ? styles.view22 : "", "", s === -1 ? styles.view23 : "", "", s >= DARK_TEXT_FROM ? styles.view24 : styles.view25, "", isWinner ? styles.view26 : mine ? styles.view27 : "", "", disabled ? styles.view28 : styles.view29, ""].filter(Boolean).join(" ")}
              style={s >= 0 ? { background: RAMP[s] } : undefined}
            >
              <span
                className={styles.view30}
                dir="ltr"
              >
                {pad(slot.hour)}:00
              </span>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 300 }}
                  className={styles.view31}
                >
                  {votesLabel(count)}
                </motion.span>
              )}
              {mine && (
                <Ticks className={styles.view32} />
              )}
              {isWinner && (
                <span
                  className={styles.view33}
                  aria-hidden
                >
                  🏁
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <VoteLegend />

      {/* Fixed height, so hovering a chip doesn't resize the grid above. */}
      <div
        className={styles.view36}
        aria-live="polite"
      >
        {error ? (
          <span className={styles.view37}>{error}</span>
        ) : detailMs !== null ? (
          <>
            <div className={styles.view38}>
              {showingMine ? "הקול שלך: " : ""}
              {formatSlot(detailMs, tz)}
              <span className={styles.view15}>
                {", "}
                {detailVoters.length
                  ? votesLabel(detailVoters.length)
                  : "אין קולות"}
              </span>
            </div>
            {(detailNames.length > 0 || (open && showingMine)) && (
              <div className={styles.view39}>
                <span className={styles.view40}>
                  {detailNames.map(iso).join(", ")}
                </span>
                {open && showingMine && (
                  <button
                    type="button"
                    onClick={() => cast(detailMs)}
                    className={styles.view41}
                  >
                    ביטול הקול
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <span className={styles.view42}>
            {room.status === "exited"
              ? `${iso(room.host_name)} ${g(room.host_gender, "יצא", "יצאה")} לפני שההצבעה נגמרה`
              : !open
                ? "ההצבעה נסגרה, סופרים קולות…"
              : canVote
                ? `לוחצים על שעה כדי להצביע. אפשר לשנות עד שההצבעה נסגרת, ${formatSlot(closes, tz)}.`
                : `${g(room.host_gender, "אתה יוצא, הם מחליטים מתי", "את יוצאת, הם מחליטים מתי")} 😉 ההצבעה נסגרת ${formatSlot(closes, tz)}.`}
          </span>
        )}
      </div>
    </section>
  );
}
