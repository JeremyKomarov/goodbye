import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type CSSProperties } from "react";
import {
  VOTE_HEATMAP_NAMESPACE, voteHeatmapKeys,
} from "@/features/room/components/VoteHeatmap/VoteHeatmap.keys.const";
import type {
  SlotMarks, VotingState,
} from "@/features/room/components/VoteHeatmap/VoteHeatmap.types";
import type { SlotFormat } from "@/features/room/hooks/useSlotFormat";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import type { Vote } from "@/features/room/types/room.types";
import { columns, DARK_TEXT_FROM, voteStep } from "@/features/room/utils/voteScale";
import { Ticks } from "@/shared/components/Ticks";
import { cn } from "@/shared/utils/cn";
import { pad } from "@/shared/utils/countdown";
import type { SlotDay } from "@/shared/utils/slots";
import { hourGridClasses } from "./HourGrid.classes";

type VoteShade = keyof typeof hourGridClasses.step;

// A day longer than this many hours packs its chips tighter.
const DENSE_FROM = 17;

interface HourGridProps {
  day: SlotDay;
  tally: Map<number, Vote[]>;
  marks: SlotMarks;
  voting: VotingState;
  onCast: (ms: number) => void;
  onFocus: (ms: number | null) => void;
  format: SlotFormat;
}

/** The day's hours as chips: brighter with more votes, ringed for yours and for the winner. */
export function HourGrid({ day, tally, marks, voting, onCast, onFocus, format }: HourGridProps) {
  const t = useTranslations(VOTE_HEATMAP_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(0, ...[...tally.values()].map((votes) => votes.length));
  const hours = day.slots.length;
  const dense = hours >= DENSE_FROM;
  const grid = {
    "--cols": columns(hours, dense ? 5 : 4, dense ? 6 : 5),
    "--cols-wide": columns(hours, 5, 8),
  } as CSSProperties;

  // If the hours scroll (a 24-hour day on a small phone), keep the anchor in view.
  useEffect(() => {
    const box = ref.current;
    const chip = box?.querySelector<HTMLElement>(`[data-ms="${marks.anchor}"]`);
    if (!box || !chip) return;
    const top = chip.offsetTop;
    if (top < box.scrollTop || top + chip.offsetHeight > box.scrollTop + box.clientHeight)
      box.scrollTop = top - (box.clientHeight - chip.offsetHeight) / 2;
  }, [marks.anchor, day]);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={t(voteHeatmapKeys.hoursOf, { day: format.day(day.ms) })}
      className={cn(hourGridClasses.root, dense && hourGridClasses.dense)}
      style={grid}
    >
      {day.slots.map((slot) => {
        if (!slot) return null;
        const count = tally.get(slot.ms)?.length ?? 0;
        const step = voteStep(count, max);
        const isMine = marks.mine === slot.ms;
        const isWinner = marks.winner === slot.ms;
        const isPast = slot.ms < voting.closesAt;
        const disabled = !voting.canCast || isPast;
        const label = t(voteHeatmapKeys.cell, {
          when: format.slot(slot.ms),
          votes: tRoom(roomKeys.votes, { count }),
          mine: String(isMine),
          winner: String(isWinner),
        });
        return (
          <motion.button
            key={slot.ms}
            type="button"
            data-ms={slot.ms}
            aria-label={label}
            aria-pressed={isMine}
            disabled={disabled}
            onClick={() => onCast(slot.ms)}
            onPointerEnter={() => onFocus(slot.ms)}
            onPointerLeave={() => onFocus(null)}
            onFocus={() => onFocus(slot.ms)}
            onBlur={() => onFocus(null)}
            whileTap={disabled ? undefined : { scale: 0.9 }}
            className={cn(
              hourGridClasses.chip,
              step < 0 ? hourGridClasses.empty : hourGridClasses.step[step as VoteShade],
              step >= DARK_TEXT_FROM && hourGridClasses.darkText,
              voting.isOpen && isPast && hourGridClasses.past,
              isWinner ? hourGridClasses.winner : isMine && hourGridClasses.mine,
              disabled && hourGridClasses.idle,
            )}
          >
            <span className={hourGridClasses.hour} dir="ltr">
              {pad(slot.hour)}:00
            </span>
            {count > 0 && (
              <motion.span
                key={count}
                className={hourGridClasses.votes}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 300 }}
              >
                {tRoom(roomKeys.votes, { count })}
              </motion.span>
            )}
            {isMine && <Ticks className={hourGridClasses.ticks} />}
            {isWinner && (
              <span className={hourGridClasses.flag} aria-hidden>
                🏁
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
