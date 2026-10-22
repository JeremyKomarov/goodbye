import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import { exactParts, roughPart, type DurationPart } from "@/features/room/utils/duration";

/** Durations in words: `exact` ("an hour and 5 minutes") and `rough` ("33 hours"). */
export function useDuration() {
  const t = useTranslations(ROOM_NAMESPACE);
  const word = useCallback(
    (part: DurationPart) => t(roomKeys.duration[part.unit], { count: part.count }),
    [t],
  );

  const exact = useCallback(
    (ms: number) => {
      const [first, second] = exactParts(ms).map(word);
      if (!first) return t(roomKeys.duration.underMinute);
      return second ? t(roomKeys.duration.pair, { first, second }) : first;
    },
    [t, word],
  );

  const rough = useCallback(
    (ms: number) => {
      const part = roughPart(ms);
      return part ? word(part) : t(roomKeys.duration.underMinute);
    },
    [t, word],
  );

  return { exact, rough };
}
