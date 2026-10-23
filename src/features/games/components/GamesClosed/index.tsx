"use client";

import type { Route } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROOM_SECTIONS, roomSectionPath } from "@/core/constants/routes.const";
import type { Room } from "@/shared/types/room.types";
import { isolate } from "@/shared/utils/isolate";
import { gamesClosedClasses } from "./GamesClosed.classes";
import { GAMES_CLOSED_NAMESPACE, gamesClosedKeys } from "./GamesClosed.keys.const";

/** Says the games closed when the host left — the records stay as they are, on the board. */
export function GamesClosed({ room }: { room: Room }) {
  const t = useTranslations(GAMES_CLOSED_NAMESPACE);
  return (
    <section className={gamesClosedClasses.root} role="status">
      <p className={gamesClosedClasses.title}>{t(gamesClosedKeys.title)}</p>
      <p className={gamesClosedClasses.body}>
        {t(gamesClosedKeys.body, { name: isolate(room.hostName), gender: room.hostGender })}
      </p>
      <Link
        href={roomSectionPath(room.slug, ROOM_SECTIONS.board) as Route}
        className={gamesClosedClasses.board}
      >
        {t(gamesClosedKeys.board)}
      </Link>
    </section>
  );
}
