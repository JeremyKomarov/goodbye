"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Room } from "@/shared/types/room.types";
import { isolate } from "@/shared/utils/isolate";
import { gamesClosedClasses } from "./GamesClosed.classes";
import { GAMES_CLOSED_NAMESPACE, gamesClosedKeys } from "./GamesClosed.keys.const";

/** Says the games closed when the host left — the records stay as they are. */
export function GamesClosed({ room, children }: { room: Room; children?: ReactNode }) {
  const t = useTranslations(GAMES_CLOSED_NAMESPACE);
  return (
    <section className={gamesClosedClasses.root} role="status">
      <p className={gamesClosedClasses.title}>{t(gamesClosedKeys.title)}</p>
      <p className={gamesClosedClasses.body}>
        {t(gamesClosedKeys.body, { name: isolate(room.hostName), gender: room.hostGender })}
      </p>
      {children}
    </section>
  );
}
