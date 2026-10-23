import { LOCALES } from "@/core/i18n/routing";

/**
 * Dates and hours in a room's timezone, in a language: "יום ה׳ 24.10 ב-14:00", "Thu 10/24 at
 * 14:00". `slotWords` joins a day and a time the language's way (the `time` namespace's `slot`).
 * Read through `useSlotFormat` on screen, and directly where there is no React — a link preview.
 */
export function slotFormat(
  locale: string,
  timeZone: string,
  slotWords: (day: string, time: string) => string,
) {
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
    slot: (ms: number) => slotWords(day(ms), time.format(ms)),
  };
}

export type SlotFormat = ReturnType<typeof slotFormat>;
