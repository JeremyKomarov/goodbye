import { TZDate } from "@date-fns/tz";

// The room's voting window, as hour slots. Ported from the original's core/slots.ts; the SQL
// function can_vote() applies the same rules on the server side of every vote.

/** The part of a room that decides which hours can be voted on. */
export interface RoomWindow {
  timezone: string;
  /** `YYYY-MM-DD`, in the room's timezone. */
  windowStart: string;
  windowEnd: string;
  dayStartHour: number;
  /** Exclusive. */
  dayEndHour: number;
}

export interface Slot {
  ms: number;
  hour: number;
}

export interface SlotDay {
  key: string;
  ms: number;
  slots: (Slot | null)[];
}

function parseDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { y, m, d };
}

export function daysBetween(start: string, end: string) {
  const a = parseDate(start);
  const b = parseDate(end);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000);
}

export function addDaysToDate(value: string, days: number) {
  const { y, m, d } = parseDate(value);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/**
 * Hour slots per day in the room's timezone. Rows line up across days, so an hour that does not
 * exist (the clocks spring forward) is `null`.
 */
export function buildSlotDays(window: RoomWindow): SlotDay[] {
  const { y, m, d } = parseDate(window.windowStart);
  const count = daysBetween(window.windowStart, window.windowEnd) + 1;
  const days: SlotDay[] = [];
  for (let i = 0; i < count; i++) {
    const midnight = new TZDate(y, m - 1, d + i, 0, 0, 0, window.timezone);
    const slots: (Slot | null)[] = [];
    for (let hour = window.dayStartHour; hour < window.dayEndHour; hour++) {
      const time = new TZDate(y, m - 1, d + i, hour, 0, 0, window.timezone);
      slots.push(time.getHours() === hour ? { ms: time.getTime(), hour } : null);
    }
    const key = `${midnight.getFullYear()}-${midnight.getMonth() + 1}-${midnight.getDate()}`;
    days.push({ key, ms: midnight.getTime(), slots });
  }
  return days;
}

export function allSlots(window: RoomWindow) {
  return buildSlotDays(window).flatMap((day) => day.slots.filter((s): s is Slot => s !== null));
}

/** Whether any hour in the window can still be voted for once voting closes at `closesAtMs`. */
export function hasSlotAfter(window: RoomWindow, closesAtMs: number) {
  return allSlots(window).some((slot) => slot.ms >= closesAtMs);
}
