import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { TIME_NAMESPACE, timeKeys } from "@/shared/strings/time.keys.const";
import { exactParts, roughPart, type DurationPart } from "@/shared/utils/duration";

/** Durations in words: `exact` ("an hour and 5 minutes") and `rough` ("33 hours"). */
export function useDuration() {
  const t = useTranslations(TIME_NAMESPACE);
  const word = useCallback(
    (part: DurationPart) => t(timeKeys.duration[part.unit], { count: part.count }),
    [t],
  );

  const exact = useCallback(
    (ms: number) => {
      const [first, second] = exactParts(ms).map(word);
      if (!first) return t(timeKeys.duration.underMinute);
      return second ? t(timeKeys.duration.pair, { first, second }) : first;
    },
    [t, word],
  );

  const rough = useCallback(
    (ms: number) => {
      const part = roughPart(ms);
      return part ? word(part) : t(timeKeys.duration.underMinute);
    },
    [t, word],
  );

  return { exact, rough };
}
