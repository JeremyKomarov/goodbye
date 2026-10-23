"use client";

import { useTranslations } from "next-intl";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import type { AdminPlayer } from "@/features/admin/types/admin.types";
import { voteProgress } from "@/features/admin/utils/voteProgress";
import { useListFormat } from "@/shared/hooks/useListFormat";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import type { Room } from "@/shared/types/room.types";
import { isolate } from "@/shared/utils/isolate";
import { whatsappLink } from "@/shared/utils/whatsapp";
import { voteReminderClasses } from "./VoteReminder.classes";

interface VoteReminderProps {
  room: Room;
  players: AdminPlayer[];
  roomUrl: string;
}

/**
 * While the vote is open: how many have voted, who has not, and one reminder to the group naming
 * them. Nothing once the vote has closed, or before anyone but the host has joined.
 */
export function VoteReminder({ room, players, roomUrl }: VoteReminderProps) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const format = useSlotFormat(room.timezone);
  const list = useListFormat();
  const { total, voted, waiting } = voteProgress(players);

  if (room.status !== ROOM_STATUSES.voting || total === 0) return null;

  const message = t(adminKeys.reminder.message, {
    names: list(waiting.map((player) => isolate(player.name))),
    slot: format.slot(room.votingClosesAt),
    url: roomUrl,
  });

  return (
    <section className={voteReminderClasses.root}>
      <h2 className={voteReminderClasses.title}>{t(adminKeys.reminder.title)}</h2>
      <p className={voteReminderClasses.count}>
        {t(adminKeys.reminder.count, { voted, total })}
      </p>
      <progress
        className={voteReminderClasses.bar}
        value={voted}
        max={total}
        aria-hidden
      />
      {waiting.length === 0 ? (
        <p className={voteReminderClasses.help}>{t(adminKeys.reminder.everyone)}</p>
      ) : (
        <>
          <p className={voteReminderClasses.help}>{t(adminKeys.reminder.waiting)}</p>
          <ul className={voteReminderClasses.names}>
            {waiting.map((player) => (
              <li key={player.userId} className={voteReminderClasses.name}>
                <bdi>{player.name}</bdi>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className={voteReminderClasses.send}
          >
            {t(adminKeys.reminder.send)}
          </a>
        </>
      )}
    </section>
  );
}
