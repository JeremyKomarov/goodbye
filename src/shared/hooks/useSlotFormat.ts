import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { TIME_NAMESPACE, timeKeys } from "@/shared/strings/time.keys.const";
import { slotFormat } from "@/shared/utils/slotFormat";

/**
 * Dates and hours in the room's timezone, in the reader's language: "יום ה׳ 24.10 ב-14:00",
 * "Thu 10/24 at 14:00". Every hour on the room's screens is formatted here.
 */
export function useSlotFormat(timeZone: string) {
  const locale = useLocale();
  const t = useTranslations(TIME_NAMESPACE);

  return useMemo(
    () => slotFormat(locale, timeZone, (day, time) => t(timeKeys.slot, { day, time })),
    [locale, timeZone, t],
  );
}

export type { SlotFormat } from "@/shared/utils/slotFormat";
