import { describe, expect, it } from "vitest";
import { verdict } from "./verdict";

const locked = Date.parse("2026-11-10T16:00:00Z");
const after = (minutes: number) => locked + minutes * 60_000;

describe("verdict", () => {
  it("is null until the host leaves", () => {
    expect(verdict({ lockedSlot: locked, exitedAt: null })).toBeNull();
  });

  it("counts ten minutes either way as on time", () => {
    expect(verdict({ lockedSlot: locked, exitedAt: after(9) })?.kind).toBe("on_time");
    expect(verdict({ lockedSlot: locked, exitedAt: after(-10) })?.kind).toBe("on_time");
  });

  it("says late or early, with by how much", () => {
    expect(verdict({ lockedSlot: locked, exitedAt: after(25) })).toEqual({
      kind: "late",
      diffMs: 25 * 60_000,
    });
    expect(verdict({ lockedSlot: locked, exitedAt: after(-180) })?.kind).toBe("early");
  });

  it("says so when the host left before the vote was over", () => {
    expect(verdict({ lockedSlot: null, exitedAt: after(-600) })).toEqual({ kind: "mid_vote" });
  });
});
