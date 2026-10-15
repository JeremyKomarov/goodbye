import { TZDate } from "@date-fns/tz";
import type { Room, Vote } from "@/core/types";

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

export type Lead = { ms: number; count: number; tied: number[] };

/**
 * Most votes leads. `tied` lists every slot sharing the top count (earliest first).
 * If voting closes on a tie, `compute_winner` in SQL draws one of them at random.
 */
export function leadingSlot(tally: Map<number, Vote[]>): Lead | null {
  let count = 0;
  let tied: number[] = [];
  for (const [ms, list] of tally) {
    if (list.length > count) {
      count = list.length;
      tied = [ms];
    } else if (list.length === count) {
      tied.push(ms);
    }
  }
  if (count === 0) return null;
  tied.sort((a, b) => a - b);
  return { ms: tied[0], count, tied };
}

/** True when the locked hour was drawn at random from a tie. */
export function wonByDraw(lead: Lead | null, lockedSlot: string | null) {
  return !!lead && !!lockedSlot && lead.tied.length > 1 && lead.tied.includes(Date.parse(lockedSlot));
}
