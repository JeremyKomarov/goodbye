import { describe, expect, it } from "vitest";
import {
  addDaysToDate,
  allSlots,
  buildSlotDays,
  daysBetween,
  hasSlotAfter,
  type RoomWindow,
} from "./slots";

const room = (overrides: Partial<RoomWindow> = {}): RoomWindow => ({
  timezone: "Asia/Jerusalem",
  windowStart: "2026-11-10",
  windowEnd: "2026-11-11",
  dayStartHour: 9,
  dayEndHour: 22,
  ...overrides,
});

describe("dates", () => {
  it("adds days across month and year ends", () => {
    expect(addDaysToDate("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysToDate("2026-02-28", 1)).toBe("2026-03-01");
    expect(daysBetween("2026-12-30", "2027-01-02")).toBe(3);
  });
});

describe("buildSlotDays", () => {
  it("makes one slot per hour in the room's timezone", () => {
    const days = buildSlotDays(room());
    expect(days).toHaveLength(2);
    expect(days[0].slots).toHaveLength(13);
    // 9:00 in Israel in November (UTC+2) is 07:00 UTC.
    expect(new Date(days[0].slots[0]!.ms).toISOString()).toBe("2026-11-10T07:00:00.000Z");
    expect(allSlots(room())).toHaveLength(26);
  });

  it("leaves a hole for the hour skipped when clocks spring forward", () => {
    // Israel moves to summer time on Friday 27.3.2026 at 02:00 -> 03:00.
    const [day] = buildSlotDays(
      room({ windowStart: "2026-03-27", windowEnd: "2026-03-27", dayStartHour: 0, dayEndHour: 5 }),
    );
    expect(day.slots.map((s) => s?.hour ?? null)).toEqual([0, 1, null, 3, 4]);
  });

  it("keeps every hour, each at a distinct time, when clocks fall back", () => {
    // Back to winter time on Sunday 25.10.2026 at 02:00 -> 01:00.
    const [day] = buildSlotDays(
      room({ windowStart: "2026-10-25", windowEnd: "2026-10-25", dayStartHour: 0, dayEndHour: 24 }),
    );
    expect(day.slots.every((s) => s !== null)).toBe(true);
    expect(new Set(day.slots.map((s) => s!.ms)).size).toBe(24);
  });
});

describe("hasSlotAfter", () => {
  it("counts the closing hour itself, and nothing after the last one", () => {
    const last = Date.parse("2026-11-11T19:00:00Z"); // 21:00 in Israel
    expect(hasSlotAfter(room(), last)).toBe(true);
    expect(hasSlotAfter(room(), last + 1)).toBe(false);
  });
});
