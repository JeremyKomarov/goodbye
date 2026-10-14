"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ticks } from "@/components/ui/Ticks";
import {
  formatDayMonth,
  formatSlot,
  formatWeekday,
  iso,
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

type Props = {
  room: Room;
  now: number;
  tally: Map<number, Vote[]>;
  players: Record<string, string>;
  myUserId: string | null;
  mySlot: number | null;
  onVote: (slotMs: number | null) => Promise<string | null>;
  className?: string;
};

/**
 * Days across, hours down. The day header and the details bar stay put; hour rows
 * grow to fill the space (up to a comfortable size) and scroll when they don't fit.
 */
export function VoteHeatmap({
  room,
  now,
  tally,
  players,
  myUserId,
  mySlot,
  onVote,
  className = "",
}: Props) {
  const days = useMemo(() => buildSlotDays(room), [room]);
  const [focused, setFocused] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const tz = room.timezone;
  const closes = Date.parse(room.voting_closes_at);
  const open = room.status === "voting" && (now === 0 || now < closes);
  const winner = room.locked_slot ? Date.parse(room.locked_slot) : null;
  const max = Math.max(0, ...[...tally.values()].map((v) => v.length));
  const hours = Array.from(
    { length: room.day_end_hour - room.day_start_hour },
    (_, i) => room.day_start_hour + i,
  );
  const columns = `2.75rem repeat(${days.length}, minmax(0, 1fr))`;

  // The row worth showing first: your vote, else the chosen hour, else the first hour you can still pick.
  const anchor = mySlot ?? winner;
  const anchorRow = hours.findIndex((_, row) =>
    days.some((day) => {
      const slot = day.slots[row];
      return slot && (anchor !== null ? slot.ms === anchor : slot.ms >= closes);
    }),
  );

  // Bring that row into view if it's scrolled out (on load, or when your vote arrives).
  useEffect(() => {
    const body = bodyRef.current;
    const cell = body?.querySelector<HTMLElement>(`[data-row="${anchorRow}"]`);
    if (!body || !cell) return;
    const top = cell.offsetTop;
    if (
      top < body.scrollTop ||
      top + cell.offsetHeight > body.scrollTop + body.clientHeight
    )
      body.scrollTop = top - (body.clientHeight - cell.offsetHeight) / 2;
  }, [anchorRow]);

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

  return (
    <section
      aria-labelledby="vote-title"
      className={`flex min-h-0 flex-col rounded-3xl bg-panel/90 p-3 pt-4 backdrop-blur-sm short:pt-3 ${className}`}
    >
      <div className="mb-3 flex shrink-0 items-baseline justify-between px-1 short:mb-2">
        <h2 id="vote-title" className="text-lg font-semibold">
          {open ? "באיזו שעה לצאת?" : "התוצאות"}
        </h2>
        <span className="text-xs text-mute">
          {open ? "לוחצים על שעה כדי להצביע" : "ההצבעה סגורה"}
        </span>
      </div>

      <div
        role="grid"
        aria-label="טבלת הצבעה לפי יום ושעה"
        className="flex min-h-0 flex-auto flex-col"
      >
        <div
          role="rowgroup"
          className="grid shrink-0 gap-[3px] px-1"
          style={{ gridTemplateColumns: columns }}
        >
          <div role="row" className="contents">
            <div role="columnheader" />
            {days.map((day) => (
              <div
                key={day.key}
                role="columnheader"
                className="pb-1 text-center leading-tight lg:flex lg:items-baseline lg:justify-center lg:gap-1.5"
              >
                <div className="text-[13px] font-medium">
                  {formatWeekday(day.ms, tz).replace("יום ", "")}
                </div>
                <div className="text-[11px] text-mute" dir="ltr">
                  {formatDayMonth(day.ms, tz)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Padding keeps the rings on edge cells from being clipped by the scroller.
            Rows may get a little shorter with a mouse than with a finger. */}
        <div
          ref={bodyRef}
          role="rowgroup"
          className="no-scrollbar relative grid min-h-0 flex-auto gap-[3px] overflow-y-auto overscroll-contain p-1 [--row-min:2.25rem] lg:[--row-min:1.75rem]"
          style={{
            gridTemplateColumns: columns,
            gridTemplateRows: `repeat(${hours.length}, minmax(var(--row-min), 2.75rem))`,
          }}
        >
          {hours.map((hour, row) => (
            <div key={hour} role="row" className="contents">
              <div
                role="rowheader"
                data-row={row}
                className="flex items-center justify-center text-[12px] tabular-nums text-mute"
                dir="ltr"
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
              {days.map((day) => {
                const slot = day.slots[row];
                if (!slot)
                  return <div key={day.key} className="hatch rounded-md" />;
                const voters = tally.get(slot.ms) ?? [];
                const count = voters.length;
                const s = step(count, max);
                const mine = mySlot === slot.ms;
                const isWinner = winner === slot.ms;
                const disabled = !open || slot.ms < closes;
                const label = `${formatSlot(slot.ms, tz)}, ${count ? votesLabel(count) : "אין קולות"}${mine ? ", הקול שלך" : ""}${isWinner ? ", השעה שנבחרה" : ""}`;
                return (
                  <motion.button
                    key={day.key}
                    type="button"
                    role="gridcell"
                    aria-label={label}
                    aria-selected={mine}
                    disabled={disabled}
                    onClick={() => cast(slot.ms)}
                    onPointerEnter={() => setFocused(slot.ms)}
                    onPointerLeave={() => setFocused(null)}
                    onFocus={() => setFocused(slot.ms)}
                    onBlur={() => setFocused(null)}
                    whileTap={disabled ? undefined : { scale: 0.86 }}
                    className={`relative grid h-full place-items-center rounded-md text-[13px] font-semibold tabular-nums transition-colors ${
                      disabled && slot.ms < closes ? "hatch opacity-40" : ""
                    } ${s === -1 ? "bg-raised" : ""} ${s >= DARK_TEXT_FROM ? "text-night" : "text-ink"} ${
                      isWinner
                        ? "ring-2 ring-exit ring-offset-2 ring-offset-panel"
                        : mine
                          ? "ring-2 ring-tick ring-offset-2 ring-offset-panel"
                          : ""
                    } ${disabled ? "cursor-default" : "hover:brightness-110"}`}
                    style={s >= 0 ? { background: RAMP[s] } : undefined}
                  >
                    {count > 0 && (
                      <motion.span
                        key={count}
                        initial={{ scale: 1.6 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 12,
                          stiffness: 300,
                        }}
                      >
                        {count}
                      </motion.span>
                    )}
                    {mine && (
                      <Ticks className="absolute bottom-0.5 left-0.5 !h-2 !w-3" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
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

      {/* Fixed height, so hovering a cell doesn't resize the grid above. */}
      <div
        className="mt-2 flex h-16 shrink-0 flex-col justify-center rounded-2xl bg-raised/70 px-4 text-sm"
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
            {`אפשר לשנות את הבחירה עד שההצבעה נסגרת, ${formatSlot(closes, tz)}.`}
          </span>
        )}
      </div>
    </section>
  );
}
