"use client";

import type { Route } from "next";
import { useTranslations } from "next-intl";
import { GAME_ORDER } from "@/core/constants/games.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { roomGamePath } from "@/core/constants/routes.const";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import { tallyVotes } from "@/shared/utils/tally";
import { useRecords } from "@/shared/hooks/useRecords";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import { rankRecords } from "@/shared/utils/records";
import { boardClasses } from "./Board.classes";
import { BOARD_NAMESPACE, boardKeys } from "./Board.keys.const";
import { GameRecords } from "./GameRecords";

// The hours section shows the three most wanted.
const TOP_HOURS = 3;

/** The room's records: the hours the group wants most, and every game's top ten. */
export function Board() {
  const t = useTranslations(BOARD_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  const { slug, snapshot, me } = useRoomContext();
  const { room } = snapshot;
  const format = useSlotFormat(room.timezone);
  const { data: records = [] } = useRecords(slug);
  const isClosed = room.status === ROOM_STATUSES.exited;
  const hours = [...tallyVotes(snapshot.votes)]
    .map(([ms, votes]) => ({ ms, count: votes.length }))
    .sort((a, b) => b.count - a.count || a.ms - b.ms)
    .slice(0, TOP_HOURS);
  const most = hours[0]?.count ?? 0;

  return (
    <div className={boardClasses.root} role="region" aria-label={t(boardKeys.label)}>
      <section className={boardClasses.card}>
        <h2 className={boardClasses.title}>{t(boardKeys.hours.title)}</h2>
        {hours.length === 0 ? (
          <p className={boardClasses.empty}>{t(boardKeys.hours.none)}</p>
        ) : (
          <ul className={boardClasses.hours}>
            {hours.map((hour) => (
              <li key={hour.ms}>
                <div className={boardClasses.hour}>
                  <span>{format.slot(hour.ms)}</span>
                  <span className={boardClasses.empty}>
                    {tRoom(roomKeys.votes, { count: hour.count })}
                  </span>
                </div>
                <div className={boardClasses.track}>
                  <div
                    className={boardClasses.bar}
                    style={{ width: `${(hour.count / most) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {GAME_ORDER.map((game) => (
        <GameRecords
          key={game}
          game={game}
          ranked={rankRecords(records, game)}
          meId={me?.userId ?? null}
          playHref={isClosed ? null : (roomGamePath(slug, game) as Route)}
        />
      ))}
    </div>
  );
}
