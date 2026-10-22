"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Player, Room } from "@/features/room/types/room.types";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { initialOf } from "@/shared/utils/avatar";
import { isolate } from "@/shared/utils/isolate";
import { roomHeaderClasses } from "./RoomHeader.classes";
import { ROOM_HEADER_NAMESPACE, roomHeaderKeys } from "./RoomHeader.keys.const";

interface RoomHeaderProps {
  room: Room;
  me: Player | null;
  playerCount: number;
  /** Opens "you in the room" (rename, your code, "not you?"). Not offered to the host. */
  onMe?: () => void;
  /** The header's end: the compact clock and the room's actions. */
  children?: ReactNode;
}

/** The chat header: the group's avatar and name, and a line saying who you are and who's here. */
export function RoomHeader({ room, me, playerCount, onMe, children }: RoomHeaderProps) {
  const t = useTranslations(ROOM_HEADER_NAMESPACE);
  const hello = me && t(roomHeaderKeys.hello, { name: isolate(me.name) });
  const inRoom = t(roomHeaderKeys.inRoom, { count: playerCount });

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
          <p className={roomHeaderClasses.subtitle}>
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
            {inRoom}
          </p>
        </div>
        {children && <div className={roomHeaderClasses.end}>{children}</div>}
      </div>
    </header>
  );
}
