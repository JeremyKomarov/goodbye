"use client";

import type { Route } from "next";
import { useTranslations } from "next-intl";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { ROOM_SECTIONS, roomSectionPath } from "@/core/constants/routes.const";
import { useListFormat } from "@/shared/hooks/useListFormat";
import { useRecords } from "@/shared/hooks/useRecords";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import type { RoomSnapshot } from "@/features/room/types/room.types";
import type { WallMessage } from "@/features/room/types/wall.types";
import { type Lead, wonByDraw } from "@/features/room/utils/tally";
import { ICON_NAMES } from "@/shared/components/Icon";
import { TAB_BAR_VARIANTS, TabBar, type TabBarItem } from "@/shared/components/TabBar";
import type { GameRecord } from "@/shared/types/records.types";
import { isolate } from "@/shared/utils/isolate";
import { champions } from "@/shared/utils/records";
import { roomNavClasses } from "./RoomNav.classes";
import { ROOM_NAV_NAMESPACE, roomNavKeys } from "./RoomNav.keys.const";

export const ROOM_NAV_VARIANTS = TAB_BAR_VARIANTS;

interface RoomNavProps {
  snapshot: RoomSnapshot;
  leader: Lead | null;
  lastMessage: WallMessage | undefined;
  /** Unread goodbyes, counted while you are on another section. */
  unread: number;
  /** Someone is typing: the wall's line says so, in the brand colour. */
  typing: string | null;
  /** This browser's player, so the records' line can say "you". */
  meId: string | null;
  variant: (typeof ROOM_NAV_VARIANTS)[keyof typeof ROOM_NAV_VARIANTS];
}

/** The room's sections — the vote, the games, the wall, the records — each with its live line. */
export function RoomNav(props: RoomNavProps) {
  const { snapshot, leader, lastMessage, unread, typing, meId, variant } = props;
  const t = useTranslations(ROOM_NAV_NAMESPACE);
  const { room } = snapshot;
  const format = useSlotFormat(room.timezone);
  const list = useListFormat();
  const { data: records = [] } = useRecords(room.slug);
  const isClosed = room.status === ROOM_STATUSES.exited;

  const voteLine =
    room.status === ROOM_STATUSES.exited
      ? t(roomNavKeys.vote.left, { name: isolate(room.hostName), gender: room.hostGender })
      : room.lockedSlot !== null
        ? t(roomNavKeys.vote.chosen, {
            drawn: String(wonByDraw(leader, room.lockedSlot)),
            slot: format.slot(room.lockedSlot),
          })
        : leader && leader.tied.length > 1
          ? t(roomNavKeys.vote.tie, { count: leader.tied.length })
          : leader
            ? t(roomNavKeys.vote.leading, { slot: format.slot(leader.ms) })
            : t(roomNavKeys.vote.none);

  const wallLine = lastMessage
    ? t(roomNavKeys.wall.last, { name: isolate(lastMessage.name), body: isolate(lastMessage.body) })
    : t(roomNavKeys.wall.none);

  // Who holds a record — each name once, "you" for yourself.
  const holderName = (r: GameRecord) =>
    r.userId === meId ? t(roomNavKeys.games.you) : isolate(r.name);
  const holders = [...new Set(champions(records).map(holderName))];
  const names = list(holders);
  const gamesLine = isClosed
    ? holders.length
      ? t(roomNavKeys.games.closedHolders, { names })
      : t(roomNavKeys.games.closed)
    : holders.length
      ? t(roomNavKeys.games.holders, { names })
      : t(roomNavKeys.games.idle);
  const players = new Set(records.map((r) => r.userId)).size;

  const items: TabBarItem[] = [
    {
      href: roomSectionPath(room.slug, ROOM_SECTIONS.vote) as Route,
      icon: ICON_NAMES.vote,
      label: t(roomNavKeys.vote.title),
      subtitle: voteLine,
      meta: snapshot.votes.length
        ? t(roomNavKeys.vote.voted, { count: snapshot.votes.length })
        : undefined,
    },
    {
      href: roomSectionPath(room.slug, ROOM_SECTIONS.games) as Route,
      icon: ICON_NAMES.games,
      label: t(roomNavKeys.games.title),
      subtitle: gamesLine,
      hasNested: true,
    },
    {
      href: roomSectionPath(room.slug, ROOM_SECTIONS.wall) as Route,
      icon: ICON_NAMES.wall,
      label: t(roomNavKeys.wall.title),
      badge: unread,
      isLive: !!typing,
      subtitle: typing ?? wallLine,
      meta: lastMessage && format.time(lastMessage.createdAt),
    },
    {
      href: roomSectionPath(room.slug, ROOM_SECTIONS.board) as Route,
      icon: ICON_NAMES.board,
      label: t(roomNavKeys.board.title),
      subtitle: players
        ? t(roomNavKeys.board.players, { count: players })
        : t(roomNavKeys.board.none),
    },
  ];

  return (
    <TabBar
      label={t(roomNavKeys.label)}
      items={items}
      variant={variant}
      className={variant === ROOM_NAV_VARIANTS.list ? roomNavClasses.list : roomNavClasses.bar}
    />
  );
}
