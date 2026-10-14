import type { Gender, Reason } from "@/lib/types";

/** Pick the masculine or feminine form. */
export function g(gender: Gender, masculine: string, feminine: string) {
  return gender === "f" ? feminine : masculine;
}

export const REASONS: Record<Reason, { m: string; f: string }> = {
  fired: { m: "פוטר", f: "פוטרה" },
  quit: { m: "התפטר", f: "התפטרה" },
  fed_up: { m: "פשוט נמאס לו", f: "פשוט נמאס לה" },
};

const formatters = new Map<string, Intl.DateTimeFormat>();
function fmt(timeZone: string, options: Intl.DateTimeFormatOptions) {
  const key = timeZone + JSON.stringify(options);
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat("he-IL", { timeZone, ...options });
    formatters.set(key, f);
  }
  return f;
}

/** "14:00" */
export function formatHour(ms: number, timeZone: string) {
  return fmt(timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(ms);
}

/** "יום ה׳" */
export function formatWeekday(ms: number, timeZone: string) {
  return fmt(timeZone, { weekday: "short" }).format(ms);
}

/** "15.10" */
export function formatDayMonth(ms: number, timeZone: string) {
  return fmt(timeZone, { day: "numeric", month: "numeric" }).format(ms);
}

/** "יום ה׳ 15.10 ב-14:00" */
export function formatSlot(ms: number, timeZone: string) {
  return `${formatWeekday(ms, timeZone)} ${formatDayMonth(ms, timeZone)} ב-${formatHour(ms, timeZone)}`;
}

/** Human duration: "17 דקות", "שעה ו-5 דקות", "יומיים ו-3 שעות". */
export function formatDuration(ms: number) {
  const totalMinutes = Math.max(0, Math.round(Math.abs(ms) / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const dayText = days === 1 ? "יום" : days === 2 ? "יומיים" : `${days} ימים`;
  const hourText = hours === 1 ? "שעה" : hours === 2 ? "שעתיים" : `${hours} שעות`;
  const minuteText = minutes === 1 ? "דקה" : `${minutes} דקות`;
  if (days > 0) return hours > 0 ? `${dayText} ו-${hourText}` : dayText;
  if (hours > 0) return minutes > 0 ? `${hourText} ו-${minuteText}` : hourText;
  return minutes === 0 ? "פחות מדקה" : minuteText;
}

/**
 * Single-unit duration for display-font headlines ("33 שעות", "75 דקות"). Avoids
 * "ו-9" pairs, which read as "1-9" in condensed display type.
 */
export function formatDurationRough(ms: number) {
  const minutes = Math.round(Math.abs(ms) / 60_000);
  if (minutes < 1) return "פחות מדקה";
  if (minutes < 90) return minutes === 1 ? "דקה" : `${minutes} דקות`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return hours === 2 ? "שעתיים" : `${hours} שעות`;
  const days = Math.round(hours / 24);
  return days === 2 ? "יומיים" : `${days} ימים`;
}

export function splitCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function votesLabel(count: number) {
  return count === 1 ? "קול אחד" : `${count} קולות`;
}

export function peopleLabel(count: number) {
  return count === 1 ? "אדם אחד" : `${count} אנשים`;
}
