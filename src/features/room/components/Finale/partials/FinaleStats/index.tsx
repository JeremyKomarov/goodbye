import { useFormatter, useTranslations } from "next-intl";
import { finaleClasses } from "@/features/room/components/Finale/Finale.classes";
import { FINALE_NAMESPACE, finaleKeys } from "@/features/room/components/Finale/Finale.keys.const";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import type { Room } from "@/shared/types/room.types";
import type { ExitSummary } from "@/shared/types/summary.types";

/** The room in numbers: the hour chosen (or leading, when the host left mid-vote), the real one. */
export function FinaleStats({ room, summary }: { room: Room; summary: ExitSummary }) {
  const t = useTranslations(FINALE_NAMESPACE);
  const format = useSlotFormat(room.timezone);
  const { number } = useFormatter();
  const keys = finaleKeys.stats;
  const stats = [
    room.lockedSlot !== null && {
      label: t(keys.chosen, { drawn: String(summary.isDrawn) }),
      value: format.slot(room.lockedSlot),
    },
    room.lockedSlot === null &&
      summary.leadingSlot !== null && {
        label: t(keys.leading),
        value: format.slot(summary.leadingSlot),
      },
    room.exitedAt !== null && {
      label: t(keys.exitedAt, { gender: room.hostGender }),
      // With its day: a host who ran off early left on another one.
      value: format.slot(room.exitedAt),
    },
    { label: t(keys.voters), value: number(summary.voterCount) },
    { label: t(keys.goodbyes), value: number(summary.messageCount) },
  ].filter((stat) => stat !== false);

  return (
    <dl className={finaleClasses.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={finaleClasses.stat}>
          <dt className={finaleClasses.label}>{stat.label}</dt>
          <dd className={finaleClasses.value}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
