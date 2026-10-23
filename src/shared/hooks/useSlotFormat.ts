import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { LOCALES } from "@/core/i18n/routing";
import { TIME_NAMESPACE, timeKeys } from "@/shared/strings/time.keys.const";

/**
 * Dates and hours in the room's timezone, in the reader's language: "יום ה׳ 24.10 ב-14:00",
 * "Thu 10/24 at 14:00". Every hour on the room's screens is formatted here.
 */
export function useSlotFormat(timeZone: string) {
  const locale = useLocale();
  const t = useTranslations(TIME_NAMESPACE);

  return useMemo(() => {
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, { timeZone, ...options });
    const weekday = format({ weekday: "short" });
    // Hebrew's short weekday is "יום ה׳"; a day chip has room for "ה׳" alone.
    const weekdayTight = format({ weekday: locale === LOCALES.he ? "narrow" : "short" });
    const dayMonth = format({ day: "numeric", month: "numeric" });
    const time = format({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const day = (ms: number) => `${weekday.format(ms)} ${dayMonth.format(ms)}`;

    return {
      day,
      weekday: (ms: number) => weekdayTight.format(ms),
      dayMonth: (ms: number) => dayMonth.format(ms),
      time: (ms: number) => time.format(ms),
      slot: (ms: number) => t(timeKeys.slot, { day: day(ms), time: time.format(ms) }),
    };
  }, [locale, timeZone, t]);
}

export type SlotFormat = ReturnType<typeof useSlotFormat>;
