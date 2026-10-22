import { useTranslations } from "next-intl";
import type { SlotFormat } from "@/features/room/hooks/useSlotFormat";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import type { Vote } from "@/features/room/types/room.types";
import { Ticks } from "@/shared/components/Ticks";
import { cn } from "@/shared/utils/cn";
import type { SlotDay } from "@/shared/utils/slots";
import {
  VOTE_HEATMAP_NAMESPACE, voteHeatmapKeys,
} from "@/features/room/components/VoteHeatmap/VoteHeatmap.keys.const";
import type { SlotMarks } from "@/features/room/components/VoteHeatmap/VoteHeatmap.types";
import { dayStripClasses } from "./DayStrip.classes";

interface DayStripProps {
  days: SlotDay[];
  dayIndex: number;
  onPick: (index: number) => void;
  tally: Map<number, Vote[]>;
  marks: SlotMarks;
  format: SlotFormat;
}

/** Pick a day: each shows its total, a tick for the day with your vote, a ring for the winner's. */
export function DayStrip({ days, dayIndex, onPick, tally, marks, format }: DayStripProps) {
  const t = useTranslations(VOTE_HEATMAP_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);

  return (
    <div role="group" aria-label={t(voteHeatmapKeys.days)} className={dayStripClasses.root}>
      {days.map((day, index) => {
        const slots = day.slots.flatMap((slot) => (slot ? [slot.ms] : []));
        const votes = slots.reduce((sum, ms) => sum + (tally.get(ms)?.length ?? 0), 0);
        const hasMine = marks.mine !== null && slots.includes(marks.mine);
        const hasWinner = marks.winner !== null && slots.includes(marks.winner);
        const label = t(voteHeatmapKeys.cell, {
          when: format.day(day.ms),
          votes: tRoom(roomKeys.votes, { count: votes }),
          mine: String(hasMine),
          winner: String(hasWinner),
        });
        return (
          <button
            key={day.key}
            type="button"
            aria-pressed={index === dayIndex}
            aria-label={label}
            onClick={() => onPick(index)}
            className={cn(
              dayStripClasses.day,
              index === dayIndex && dayStripClasses.selected,
              hasWinner && dayStripClasses.winner,
            )}
          >
            <span className={dayStripClasses.name}>
              {format.weekday(day.ms)}
              {hasMine && <Ticks className={dayStripClasses.ticks} />}
            </span>
            <span className={dayStripClasses.date} dir="ltr">
              {format.dayMonth(day.ms)}
            </span>
            {votes > 0 && <span className={dayStripClasses.count}>{votes}</span>}
          </button>
        );
      })}
    </div>
  );
}
