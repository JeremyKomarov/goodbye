"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ticks } from "@/components/ui/Ticks";
import {
  formatDayMonth,
  formatSlot,
  formatWeekday,
  g,
  iso,
  pad,
  votesLabel,
} from "@/lib/hebrew";
import { buildSlotDays } from "@/lib/slots";
import type { Room, Vote } from "@/lib/types";

// One hue, brighter with more votes (dark mode flips the light->dark anchor).
const RAMP = [
  "oklch(0.36 0.06 168)",
  "oklch(0.45 0.09 166)",
  "oklch(0.54 0.12 164)",
  "oklch(0.63 0.14 162)",
  "oklch(0.72 0.16 160)",
];
const DARK_TEXT_FROM = 3; // steps 4–5 are light enough to need dark text

function step(count: number, max: number) {
  if (count === 0 || max === 0) return -1;
  return Math.min(RAMP.length - 1, Math.ceil((count / max) * RAMP.length) - 1);
}

/** Columns for `n` hour chips: as few rows as possible, then the fullest last row. */
function columns(n: number, min: number, max: number) {
  let best = Math.max(1, Math.min(n, min));
  for (let c = best + 1; c <= Math.min(n, max); c++) {
    const rows = Math.ceil(n / c);
    const bestRows = Math.ceil(n / best);
    const fill = (n % c || c) / c;
    const bestFill = (n % best || best) / best;
    if (rows < bestRows || (rows === bestRows && fill > bestFill)) best = c;
  }
  return best;
}

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
      className={`@container flex min-h-0 flex-col rounded-3xl bg-panel/90 p-3 pt-4 backdrop-blur-sm short:pt-3 ${className}`}
    >
      <div className="mb-2 flex shrink-0 items-baseline justify-between gap-3 px-1 tiny:mb-1">
        <h2 id="vote-title" className="text-lg font-semibold">
          {open ? "באיזו שעה לצאת?" : "התוצאות"}
        </h2>
        <span className="truncate text-xs text-mute">
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
          className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto p-1"
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
                className={`relative flex min-w-11 flex-1 flex-col items-center rounded-2xl px-2 py-1.5 leading-tight transition-colors ${
                  oneLine
                    ? "short:flex-row short:items-baseline short:justify-center short:gap-1.5"
                    : ""
                } ${selected ? "bg-bubble" : "bg-raised/60 hover:bg-raised"} ${
                  hasWinner ? "ring-2 ring-exit ring-inset" : ""
                }`}
              >
                <span className="flex items-center gap-1 text-[13px] font-semibold">
                  {formatWeekday(d.ms, tz).replace("יום ", "")}
                  {hasMine && <Ticks className="!h-2 !w-3" />}
                </span>
                <span
                  className={`text-[11px] ${selected ? "text-ink/75" : "text-mute"}`}
                  dir="ltr"
                >
                  {formatDayMonth(d.ms, tz)}
                </span>
                {votes > 0 && (
                  <span className="absolute -end-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-signal px-1 text-[10px] font-bold tabular-nums text-night">
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
        className={`no-scrollbar grid min-h-0 grid-cols-[repeat(var(--cols),minmax(0,1fr))] content-start gap-1.5 overflow-y-auto overscroll-contain p-1 [--row-min:2.5rem] ${dense ? "short:[--row-min:2rem]" : "short:[--row-min:2.25rem]"} tiny:grid-cols-[repeat(var(--cols-wide),minmax(0,1fr))] @min-[27rem]:grid-cols-[repeat(var(--cols-wide),minmax(0,1fr))]`}
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
              className={`relative flex flex-col items-center justify-center rounded-xl leading-none transition-colors ${
                open && past ? "hatch opacity-40" : ""
              } ${s === -1 ? "bg-raised" : ""} ${s >= DARK_TEXT_FROM ? "text-night" : "text-ink"} ${
                isWinner
                  ? "ring-2 ring-exit ring-offset-2 ring-offset-panel"
                  : mine
                    ? "ring-2 ring-tick ring-offset-2 ring-offset-panel"
                    : ""
              } ${disabled ? "cursor-default" : "hover:brightness-110"}`}
              style={s >= 0 ? { background: RAMP[s] } : undefined}
            >
              <span
                className="text-[15px] font-semibold tabular-nums"
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
                  className="mt-1 text-[11px] font-medium opacity-80"
                >
                  {votesLabel(count)}
                </motion.span>
              )}
              {mine && (
                <Ticks className="absolute bottom-1 start-1.5 !h-2 !w-3" />
              )}
              {isWinner && (
                <span
                  className="absolute end-1 top-1 text-[10px] leading-none"
                  aria-hidden
                >
                  🏁
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div
        className="mt-2 flex shrink-0 items-center justify-end gap-1.5 px-1 text-[11px] text-mute short:hidden"
        aria-hidden
      >
        <span>פחות קולות</span>
        {RAMP.map((c) => (
          <span
            key={c}
            className="h-2.5 w-4 rounded-sm"
            style={{ background: c }}
          />
        ))}
        <span>יותר</span>
      </div>

      {/* Fixed height, so hovering a chip doesn't resize the grid above. */}
      <div
        className="mt-2 flex h-16 shrink-0 flex-col justify-center rounded-2xl bg-raised/70 px-4 text-sm tiny:h-12 tiny:text-[13px]"
        aria-live="polite"
      >
        {error ? (
          <span className="line-clamp-2 text-exit">{error}</span>
        ) : detailMs !== null ? (
          <>
            <div className="truncate font-medium">
              {showingMine ? "הקול שלך: " : ""}
              {formatSlot(detailMs, tz)}
              <span className="text-mute">
                {", "}
                {detailVoters.length
                  ? votesLabel(detailVoters.length)
                  : "אין קולות"}
              </span>
            </div>
            {(detailNames.length > 0 || (open && showingMine)) && (
              <div className="mt-0.5 flex items-baseline gap-3">
                <span className="min-w-0 flex-1 truncate text-mute">
                  {detailNames.map(iso).join(", ")}
                </span>
                {open && showingMine && (
                  <button
                    type="button"
                    onClick={() => cast(detailMs)}
                    className="shrink-0 text-xs text-tick underline-offset-2 hover:underline"
                  >
                    ביטול הקול
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <span className="line-clamp-2 text-mute">
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
