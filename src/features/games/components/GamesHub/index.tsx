"use client";

import { motion } from "motion/react";
import type { Route } from "next";
import { useTranslations } from "next-intl";
import { GAME_ORDER } from "@/core/constants/games.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { roomGamePath } from "@/core/constants/routes.const";
import { GamesClosed } from "@/features/games/components/GamesClosed";
import { useRecords } from "@/shared/hooks/useRecords";
import { useRoomFrame } from "@/shared/hooks/useRoomFrame";
import { rankRecords } from "@/shared/utils/records";
import { gamesHubClasses } from "./GamesHub.classes";
import { GAMES_HUB_NAMESPACE, gamesHubKeys } from "./GamesHub.keys.const";
import { GameTile } from "./GameTile";

/** The games section: every game with the room's record — closed once the host has left. */
export function GamesHub() {
  const t = useTranslations(GAMES_HUB_NAMESPACE);
  const { room, meId } = useRoomFrame();
  const { data: records = [] } = useRecords(room.slug);
  const isClosed = room.status === ROOM_STATUSES.exited;

  return (
    <section className={gamesHubClasses.root} aria-label={t(gamesHubKeys.label)}>
      {isClosed && <GamesClosed room={room} />}
      <ul className={gamesHubClasses.list}>
        {GAME_ORDER.map((game, i) => (
          <motion.li
            key={game}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GameTile
              game={game}
              href={isClosed ? null : (roomGamePath(room.slug, game) as Route)}
              top={rankRecords(records, game)[0]}
              myBest={records.find((r) => r.game === game && r.userId === meId)?.score}
              meId={meId}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
