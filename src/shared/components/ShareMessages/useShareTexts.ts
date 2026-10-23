import { useTranslations } from "next-intl";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { useExitSummary } from "@/shared/hooks/useExitSummary";
import { useGameWords } from "@/shared/hooks/useGameWords";
import { useRecords } from "@/shared/hooks/useRecords";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import type { Room } from "@/shared/types/room.types";
import { isolate } from "@/shared/utils/isolate";
import { champions } from "@/shared/utils/records";
import { SHARE_MESSAGES_NAMESPACE, shareMessagesKeys } from "./ShareMessages.keys.const";

const keys = shareMessagesKeys;

export interface ShareText {
  id: "result" | "goodbye";
  title: string;
  when: string;
  text: string;
}

/**
 * The host's messages with the room's real numbers, in the reader's language. The decision is
 * news only until the host leaves. Null while the numbers are being read.
 */
export function useShareTexts(room: Room, url: string): ShareText[] | null {
  const t = useTranslations(SHARE_MESSAGES_NAMESPACE);
  const format = useSlotFormat(room.timezone);
  const words = useGameWords();
  const { data: summary } = useExitSummary(room.slug);
  const { data: records } = useRecords(room.slug);
  if (!summary || !records) return null;

  const gender = room.hostGender;
  const voters = t(keys.voters, { count: summary.voterCount });
  const { loved } = summary;
  const at =
    room.lockedSlot === null ? "" : t(keys.goodbye.at, { time: format.time(room.lockedSlot) });
  const goodbye = [
    t(keys.goodbye.leaving, { gender, at }),
    "",
    t(keys.goodbye.counts, {
      voters,
      goodbyes: t(keys.goodbyes, { count: summary.messageCount }),
    }),
    ...(loved
      ? [t(keys.goodbye.loved, { body: isolate(loved.body), name: isolate(loved.name) })]
      : []),
    ...champions(records).map((top) =>
      t(keys.goodbye.champion, { game: words.title(top.game), name: isolate(top.name) }),
    ),
    "",
    t(keys.goodbye.thanks, { url }),
  ];
  const texts: ShareText[] = [
    {
      id: "goodbye",
      title: t(keys.goodbye.title),
      when: t(keys.goodbye.when),
      text: goodbye.join("\n"),
    },
  ];
  if (room.status === ROOM_STATUSES.locked && room.lockedSlot !== null) {
    const decided = t(keys.result.decided, {
      name: isolate(room.hostName),
      gender,
      slot: format.slot(room.lockedSlot),
    });
    texts.unshift({
      id: "result",
      title: t(keys.result.title),
      when: t(keys.result.when),
      text: [
        decided + (summary.isDrawn ? t(keys.result.drawn) : ""),
        t(keys.result.where, { voters, url }),
      ].join("\n"),
    });
  }
  return texts;
}
