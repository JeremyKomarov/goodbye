import { describe, expect, it } from "vitest";
import { openSlotCount, type WindowFields } from "./openSlotCount";

// One day, 09:00–22:00 in Jerusalem (UTC+2 in November): 13 hours, the first at 07:00 UTC.
const window: WindowFields = {
  timezone: "Asia/Jerusalem",
  windowStart: "2026-11-10",
  days: 1,
  dayStartHour: 9,
  dayEndHour: 22,
  votingClosesAt: "2026-11-09T18:00:00.000Z",
};

describe("openSlotCount", () => {
  it("counts every hour when voting closes before the window", () => {
    expect(openSlotCount(window)).toBe(13);
  });

  it("counts each day of a longer window", () => {
    expect(openSlotCount({ ...window, days: 3 })).toBe(39);
  });

  it("counts only the hours from the close on, the close's own hour included", () => {
    expect(openSlotCount({ ...window, votingClosesAt: "2026-11-10T17:00:00.000Z" })).toBe(3);
  });

  it("is 0 once voting closes after the last hour", () => {
    expect(openSlotCount({ ...window, votingClosesAt: "2026-11-11T00:00:00.000Z" })).toBe(0);
  });

  it("is 0 for a backwards or unfinished window", () => {
    expect(openSlotCount({ ...window, dayEndHour: 9 })).toBe(0);
    expect(openSlotCount({ ...window, windowStart: "" })).toBe(0);
    expect(openSlotCount({ ...window, votingClosesAt: "" })).toBe(0);
  });
});
