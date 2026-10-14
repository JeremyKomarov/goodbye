import { TZDate } from "@date-fns/tz";
import type { Room, Vote } from "@/lib/types";

export type Slot = { ms: number; hour: number };
export type SlotDay = { key: string; ms: number; slots: (Slot | null)[] };

type WindowSpec = Pick<Room, "timezone" | "window_start" | "window_end" | "day_start_hour" | "day_end_hour">;

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
 * Hour slots per day in the room timezone. Rows line up across days, so a slot that
 * doesn't exist (DST spring-forward) is `null`.
 */
export function buildSlotDays(room: WindowSpec): SlotDay[] {
  const { y, m, d } = parseDate(room.window_start);
  const count = daysBetween(room.window_start, room.window_end) + 1;
  const days: SlotDay[] = [];
  for (let i = 0; i < count; i++) {
    const midnight = new TZDate(y, m - 1, d + i, 0, 0, 0, room.timezone);
    const slots: (Slot | null)[] = [];
    for (let h = room.day_start_hour; h < room.day_end_hour; h++) {
      const t = new TZDate(y, m - 1, d + i, h, 0, 0, room.timezone);
      slots.push(t.getHours() === h ? { ms: t.getTime(), hour: h } : null);
    }
    days.push({ key: `${midnight.getFullYear()}-${midnight.getMonth() + 1}-${midnight.getDate()}`, ms: midnight.getTime(), slots });
  }
  return days;
}

export function allSlots(room: WindowSpec) {
  return buildSlotDays(room).flatMap((day) => day.slots.filter((s): s is Slot => s !== null));
}

export function slotMs(iso: string) {
  return Date.parse(iso);
}

/** Votes grouped by slot start (ms). */
export function tallyVotes(votes: Vote[]) {
  const tally = new Map<number, Vote[]>();
  for (const vote of votes) {
    const key = slotMs(vote.slot_start);
    const list = tally.get(key);
    if (list) list.push(vote);
    else tally.set(key, [vote]);
  }
  return tally;
}

/** Same rule as `compute_winner` in SQL: most votes, ties go to the earliest slot. */
export function leadingSlot(tally: Map<number, Vote[]>) {
  let best: { ms: number; count: number } | null = null;
  for (const [ms, list] of tally) {
    if (!best || list.length > best.count || (list.length === best.count && ms < best.ms)) {
      best = { ms, count: list.length };
    }
  }
  return best;
}
