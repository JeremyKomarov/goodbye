"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { THEME_EMOJI } from "@/features/room/components/EmojiRain/EmojiRain.const";
import type { Player } from "@/features/room/types/room.types";
import type { Room } from "@/shared/types/room.types";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { initialOf } from "@/shared/utils/avatar";
import { cn } from "@/shared/utils/cn";
import { pad, splitCountdown } from "@/shared/utils/countdown";
import { isolate } from "@/shared/utils/isolate";
import { roomTheme } from "@/shared/utils/roomTheme";
import { roomHeaderClasses } from "./RoomHeader.classes";
import { ROOM_HEADER_NAMESPACE, roomHeaderKeys } from "./RoomHeader.keys.const";

interface RoomHeaderProps {
  room: Room;
  me: Player | null;
  /** How many are here now, by presence; and "Dana is typing…", shown in place of that line. */
  live: { online: number; typing: string | null };
  /** In place of the group's initial: the status ring around it. */
  avatar?: ReactNode;
  /** The clock beside the name — passed off the vote, where the big one already shows. */
  now?: number;
  /** Opens "you in the room" (rename, your code, "not you?"). Not offered to the host. */
  onMe?: () => void;
  /** The header's end: 🎉 for everyone, and — for the host's browser — the way to the admin page. */
  actions: { onParty: () => void; adminHref?: string };
}

/** The chat header: the group's avatar and name, and a line saying who you are and who's here. */
export function RoomHeader(props: RoomHeaderProps) {
  const { room, me, live, avatar, now, onMe, actions } = props;
  const { online, typing } = live;
  const t = useTranslations(ROOM_HEADER_NAMESPACE);
  const hello = me && t(roomHeaderKeys.hello, { name: isolate(me.name) });
  const target = room.status === ROOM_STATUSES.locked ? room.lockedSlot : room.votingClosesAt;
  const left = now && target !== null && room.status !== ROOM_STATUSES.exited ? target - now : 0;
  const parts = splitCountdown(left);
  const clock =
    left <= 0
      ? null
      : parts.days > 0
        ? t(roomHeaderKeys.inDays, { count: parts.days })
        : `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;

  return (
    <header className={roomHeaderClasses.root}>
      <div className={roomHeaderClasses.bar}>
        {avatar ?? (
          <span className={roomHeaderClasses.avatar} aria-hidden>
            {initialOf(room.groupName)}
          </span>
        )}
        <div className={roomHeaderClasses.text}>
          <h1 className={roomHeaderClasses.title}>
            <bdi>{room.groupName}</bdi>
          </h1>
          <p
            className={cn(roomHeaderClasses.subtitle, typing && roomHeaderClasses.live)}
            aria-live="polite"
          >
            {typing ?? (
              <>
                {hello &&
                  (onMe ? (
                    <Button
                      variant={BUTTON_VARIANTS.link}
                      title={t(roomHeaderKeys.rename)}
                      onClick={onMe}
                    >
                      {hello}
                    </Button>
                  ) : (
                    hello
                  ))}
                {hello && " · "}
                {t(roomHeaderKeys.online, { count: online })}
              </>
            )}
          </p>
        </div>
        {clock && (
          <span
            dir="ltr"
            className={cn(
              roomHeaderClasses.clock,
              room.status === ROOM_STATUSES.locked && roomHeaderClasses.clockLocked,
            )}
          >
            {clock}
          </span>
        )}
        <Button
          variant={BUTTON_VARIANTS.ghost}
          aria-label={t(roomHeaderKeys.party)}
          title={t(roomHeaderKeys.party)}
          onClick={actions.onParty}
        >
          {THEME_EMOJI[roomTheme(room.reason)].party}
        </Button>
        {actions.adminHref && (
          <Link
            href={actions.adminHref}
            className={roomHeaderClasses.admin}
            aria-label={t(roomHeaderKeys.admin)}
            title={t(roomHeaderKeys.adminTitle)}
          >
            <Icon name={ICON_NAMES.admin} />
          </Link>
        )}
      </div>
    </header>
  );
}
