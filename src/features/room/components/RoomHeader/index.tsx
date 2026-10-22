"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import type { Player, Room } from "@/features/room/types/room.types";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { initialOf } from "@/shared/utils/avatar";
import { cn } from "@/shared/utils/cn";
import { pad, splitCountdown } from "@/shared/utils/countdown";
import { isolate } from "@/shared/utils/isolate";
import { roomHeaderClasses } from "./RoomHeader.classes";
import { ROOM_HEADER_NAMESPACE, roomHeaderKeys } from "./RoomHeader.keys.const";

interface RoomHeaderProps {
  room: Room;
  me: Player | null;
  /** How many are here now, by presence. */
  online: number;
  /** "Dana is typing…", in place of the line under the name. */
  typing: string | null;
  /** The clock beside the name — passed off the vote, where the big one already shows. */
  now?: number;
  /** Opens "you in the room" (rename, your code, "not you?"). Not offered to the host. */
  onMe?: () => void;
  /** The header's end: the room's actions. */
  children?: ReactNode;
}

/** The chat header: the group's avatar and name, and a line saying who you are and who's here. */
export function RoomHeader({ room, me, online, typing, now, onMe, children }: RoomHeaderProps) {
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
        <span className={roomHeaderClasses.avatar} aria-hidden>
          {initialOf(room.groupName)}
        </span>
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
        {children && <div className={roomHeaderClasses.end}>{children}</div>}
      </div>
    </header>
  );
}
