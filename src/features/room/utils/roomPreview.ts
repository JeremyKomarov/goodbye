import { createTranslator } from "next-intl";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { messages } from "@/core/i18n/messages";
import type { Locale } from "@/core/i18n/routing";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import {
  ROOM_PREVIEW_NAMESPACE, roomPreviewKeys,
} from "@/features/room/strings/roomPreview.keys.const";
import { SITE_NAMESPACE, siteKeys } from "@/shared/strings/site.keys.const";
import { TIME_NAMESPACE, timeKeys } from "@/shared/strings/time.keys.const";
import type { Room } from "@/shared/types/room.types";
import { durationWords } from "@/shared/utils/duration";
import { slotFormat } from "@/shared/utils/slotFormat";
import { verdict } from "@/shared/utils/verdict";

// The card's big lines cannot wrap, so a long name is cut.
const CARD_NAME_MAX = 14;
const CARD_GROUP_MAX = 16;

export interface RoomPreview {
  title: string;
  /** Null for an unknown room, which keeps the site's. */
  description: string | null;
  card: { pill: string; lines: string[] };
}

/**
 * A room as a shared link shows it, in a language: the question while the group votes, the
 * decision once the hour is locked, the verdict once the host has left. Words only — no React —
 * so the room's metadata and its preview image read the same.
 */
export function roomPreview(room: Room | null, locale: Locale): RoomPreview {
  const translator = <N extends keyof typeof messages.he>(namespace: N) =>
    createTranslator({ locale, messages: messages[locale], namespace });
  const t = translator(ROOM_PREVIEW_NAMESPACE);
  const tSite = translator(SITE_NAMESPACE);
  if (!room)
    return {
      title: t(roomPreviewKeys.title.notFound),
      description: null,
      card: {
        pill: t(roomPreviewKeys.title.notFound),
        lines: [tSite(siteKeys.card.first), tSite(siteKeys.card.second)],
      },
    };

  const tTime = translator(TIME_NAMESPACE);
  const tHero = translator(HERO_NAMESPACE);
  const format = slotFormat(locale, room.timezone, (day, time) =>
    tTime(timeKeys.slot, { day, time }),
  );
  const { rough } = durationWords({
    part: ({ unit, count }) => tTime(timeKeys.duration[unit], { count }),
    pair: (first, second) => tTime(timeKeys.duration.pair, { first, second }),
    underMinute: tTime(timeKeys.duration.underMinute),
  });
  const gender = room.hostGender;
  const words = { name: room.hostName, group: room.groupName, gender };
  const short = {
    name: room.hostName.slice(0, CARD_NAME_MAX),
    group: room.groupName.slice(0, CARD_GROUP_MAX),
    gender,
  };
  const outcome = verdict(room);

  if (room.status === ROOM_STATUSES.exited && outcome) {
    const said = tHero(heroKeys.exited.verdict, {
      kind: outcome.kind,
      gender,
      by: "diffMs" in outcome ? rough(outcome.diffMs) : "",
    });
    return {
      title: t(roomPreviewKeys.title.exited, { ...words, verdict: said }),
      description: t(roomPreviewKeys.description.exited),
      card: {
        pill: t(roomPreviewKeys.card.exited.pill, short),
        lines: [t(roomPreviewKeys.card.exited.first, short), said],
      },
    };
  }
  if (room.status === ROOM_STATUSES.locked && room.lockedSlot !== null) {
    const at = room.lockedSlot;
    return {
      title: t(roomPreviewKeys.title.locked, { ...words, slot: format.slot(at) }),
      description: t(roomPreviewKeys.description.locked),
      card: {
        pill: t(roomPreviewKeys.card.locked.pill),
        lines: [
          t(roomPreviewKeys.card.locked.first, short),
          t(roomPreviewKeys.card.locked.second, { day: format.day(at), time: format.time(at) }),
        ],
      },
    };
  }
  return {
    title: t(roomPreviewKeys.title.voting, words),
    description: t(roomPreviewKeys.description.voting),
    card: {
      pill: t(roomPreviewKeys.card.voting.pill),
      lines: [
        t(roomPreviewKeys.card.voting.first, short),
        t(roomPreviewKeys.card.voting.second, short),
      ],
    },
  };
}
