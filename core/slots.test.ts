import { describe, expect, it } from "vitest";
import { makeRoom } from "@/core/test/room";
import {
  addDaysToDate,
  allSlots,
  buildSlotDays,
  daysBetween,
  leadingSlot,
  tallyVotes,
  wonByDraw,
} from "@/core/slots";
import type { Vote } from "@/core/types";

const vote = (user: string, slot: string, id = 1): Vote => ({
  id,
  room_id: "r",
  user_id: user,
  slot_start: slot,
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
    const days = buildSlotDays(makeRoom());
    expect(days).toHaveLength(2);
    expect(days[0].slots).toHaveLength(13);
    // 9:00 in Israel in November (UTC+2) is 07:00 UTC.
    expect(new Date(days[0].slots[0]!.ms).toISOString()).toBe("2026-11-10T07:00:00.000Z");
    expect(allSlots(makeRoom())).toHaveLength(26);
  });

  it("leaves a hole for the hour skipped when clocks spring forward", () => {
    // Israel moves to summer time on Friday 27.3.2026 at 02:00 -> 03:00.
    const [day] = buildSlotDays(
      makeRoom({ window_start: "2026-03-27", window_end: "2026-03-27", day_start_hour: 0, day_end_hour: 5 }),
    );
    expect(day.slots.map((s) => s?.hour ?? null)).toEqual([0, 1, null, 3, 4]);
  });

  it("keeps every hour, each at a distinct time, when clocks fall back", () => {
    // Back to winter time on Sunday 25.10.2026 at 02:00 -> 01:00.
    const [day] = buildSlotDays(
      makeRoom({ window_start: "2026-10-25", window_end: "2026-10-25", day_start_hour: 0, day_end_hour: 24 }),
    );
    expect(day.slots.every((s) => s !== null)).toBe(true);
    expect(new Set(day.slots.map((s) => s!.ms)).size).toBe(24);
  });
});

describe("leadingSlot", () => {
  it("is null with no votes", () => {
    expect(leadingSlot(tallyVotes([]))).toBeNull();
  });

  it("picks the slot with the most votes", () => {
    const lead = leadingSlot(
      tallyVotes([
        vote("a", "2026-11-10T07:00:00Z"),
        vote("b", "2026-11-10T08:00:00Z"),
        vote("c", "2026-11-10T08:00:00Z"),
      ]),
    );
    expect(lead).toMatchObject({ ms: Date.parse("2026-11-10T08:00:00Z"), count: 2 });
    expect(lead!.tied).toHaveLength(1);
  });

  it("lists every tied slot, earliest first", () => {
    const lead = leadingSlot(
      tallyVotes([vote("a", "2026-11-10T09:00:00Z"), vote("b", "2026-11-10T07:00:00Z")]),
    );
    expect(lead!.tied).toEqual([Date.parse("2026-11-10T07:00:00Z"), Date.parse("2026-11-10T09:00:00Z")]);
  });

  it("knows when the locked hour came from a draw", () => {
    const tied = leadingSlot(
      tallyVotes([vote("a", "2026-11-10T09:00:00Z"), vote("b", "2026-11-10T07:00:00Z")]),
    );
    expect(wonByDraw(tied, "2026-11-10T09:00:00Z")).toBe(true);
    const clear = leadingSlot(tallyVotes([vote("a", "2026-11-10T09:00:00Z")]));
    expect(wonByDraw(clear, "2026-11-10T09:00:00Z")).toBe(false);
  });
});
