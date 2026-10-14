"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Ticks } from "@/components/ui/Ticks";
import {
  formatDayMonth,
  formatSlot,
  formatWeekday,
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
};

export function VoteHeatmap({
  room,
  now,
  tally,
  players,
  myUserId,
  mySlot,
  onVote,
}: Props) {
  const days = useMemo(() => buildSlotDays(room), [room]);
  const [focused, setFocused] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tz = room.timezone;
  const closes = Date.parse(room.voting_closes_at);
  const open = room.status === "voting" && (now === 0 || now < closes);
  const winner = room.locked_slot ? Date.parse(room.locked_slot) : null;
  const max = Math.max(0, ...[...tally.values()].map((v) => v.length));
  const hours = Array.from(
    { length: room.day_end_hour - room.day_start_hour },
    (_, i) => room.day_start_hour + i,
  );

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

  return (
    <section
      aria-labelledby="vote-title"
      className="rounded-3xl bg-panel/90 p-3 pt-4 backdrop-blur-sm"
    >
      <div className="mb-3 flex items-baseline justify-between px-1">
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
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `2.75rem repeat(${days.length}, minmax(0, 1fr))`,
        }}
      >
        <div role="row" className="contents">
          <div role="columnheader" />
          {days.map((day) => (
            <div
              key={day.key}
              role="columnheader"
              className="pb-1 text-center leading-tight"
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

        {hours.map((hour, row) => (
          <div key={hour} role="row" className="contents">
            <div
              role="rowheader"
              className="flex items-center justify-center text-[12px] tabular-nums text-mute"
              dir="ltr"
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
            {days.map((day) => {
              const slot = day.slots[row];
              if (!slot)
                return <div key={day.key} className="hatch h-10 rounded-md" />;
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
                  className={`relative grid h-10 place-items-center rounded-md text-[13px] font-semibold tabular-nums transition-colors ${
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

      <div
        className="mt-3 flex items-center justify-end gap-1.5 px-1 text-[11px] text-mute"
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

      <div
        className="mt-3 min-h-[3.5rem] rounded-2xl bg-raised/70 px-4 py-3 text-sm"
        aria-live="polite"
      >
        {error ? (
          <span className="text-exit">{error}</span>
        ) : detailMs !== null ? (
          <>
            <div className="font-medium">
              {detailMs === mySlot && focused === null ? "הקול שלך: " : ""}
              {formatSlot(detailMs, tz)}
              <span className="text-mute">
                {", "}
                {detailVoters.length
                  ? votesLabel(detailVoters.length)
                  : "אין קולות"}
              </span>
            </div>
            {detailNames.length > 0 && (
              <div className="mt-0.5 truncate text-mute">
                {detailNames.join(", ")}
              </div>
            )}
            {open && detailMs === mySlot && focused === null && (
              <button
                type="button"
                onClick={() => cast(detailMs)}
                className="mt-1 text-xs text-tick underline-offset-2 hover:underline"
              >
                ביטול הקול
              </button>
            )}
          </>
        ) : (
          <span className="text-mute">
            {`אפשר לשנות את הבחירה עד שההצבעה נסגרת, ${formatSlot(closes, tz)}.`}
          </span>
        )}
      </div>
    </section>
  );
}
