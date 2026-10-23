import { describe, expect, it } from "vitest";
import { leadingSlot, tallyVotes, wonByDraw } from "./tally";

const at = (iso: string) => Date.parse(iso);
const vote = (userId: string, slot: string) => ({ userId, slotMs: at(slot) });

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
    expect(lead).toMatchObject({ ms: at("2026-11-10T08:00:00Z"), count: 2 });
    expect(lead!.tied).toHaveLength(1);
  });

  it("lists every tied slot, earliest first", () => {
    const lead = leadingSlot(
      tallyVotes([vote("a", "2026-11-10T09:00:00Z"), vote("b", "2026-11-10T07:00:00Z")]),
    );
    expect(lead!.tied).toEqual([at("2026-11-10T07:00:00Z"), at("2026-11-10T09:00:00Z")]);
  });

  it("knows when the locked hour came from a draw", () => {
    const tied = leadingSlot(
      tallyVotes([vote("a", "2026-11-10T09:00:00Z"), vote("b", "2026-11-10T07:00:00Z")]),
    );
    expect(wonByDraw(tied, at("2026-11-10T09:00:00Z"))).toBe(true);
    const clear = leadingSlot(tallyVotes([vote("a", "2026-11-10T09:00:00Z")]));
    expect(wonByDraw(clear, at("2026-11-10T09:00:00Z"))).toBe(false);
    expect(wonByDraw(tied, null)).toBe(false);
  });
});
