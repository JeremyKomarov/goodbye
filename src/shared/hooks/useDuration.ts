import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { TIME_NAMESPACE, timeKeys } from "@/shared/strings/time.keys.const";
import { durationWords } from "@/shared/utils/duration";

/** Durations in words: `exact` ("an hour and 5 minutes") and `rough` ("33 hours"). */
export function useDuration() {
  const t = useTranslations(TIME_NAMESPACE);

  return useMemo(
    () =>
      durationWords({
        part: ({ unit, count }) => t(timeKeys.duration[unit], { count }),
        pair: (first, second) => t(timeKeys.duration.pair, { first, second }),
        underMinute: t(timeKeys.duration.underMinute),
      }),
    [t],
  );
}
