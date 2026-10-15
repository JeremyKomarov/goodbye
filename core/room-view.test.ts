import { describe, expect, it } from "vitest";
import { verdict, verdictText } from "@/core/room-view";
import { makeRoom } from "@/core/test/room";

const locked = "2026-11-10T16:00:00Z";
const exitedAt = (minutes: number) => new Date(Date.parse(locked) + minutes * 60_000).toISOString();

describe("verdict", () => {
  it("is null until the host leaves", () => {
    expect(verdict(makeRoom({ locked_slot: locked }))).toBeNull();
    expect(verdictText(makeRoom({ locked_slot: locked }))).toBeNull();
  });

  it("counts ten minutes either way as on time", () => {
    expect(verdictText(makeRoom({ locked_slot: locked, exited_at: exitedAt(9) }))).toBe("בדיוק בזמן");
    expect(verdictText(makeRoom({ locked_slot: locked, exited_at: exitedAt(-10) }))).toBe("בדיוק בזמן");
  });

  it("says late or early, in the host's gender", () => {
    expect(verdictText(makeRoom({ locked_slot: locked, exited_at: exitedAt(25) }))).toBe("איחר ב-25 דקות");
    expect(
      verdictText(makeRoom({ host_gender: "f", locked_slot: locked, exited_at: exitedAt(-180) })),
    ).toBe("ברחה 3 שעות מוקדם");
  });

  it("says so when the host left before the vote was over", () => {
    const room = makeRoom({ status: "exited", exited_at: "2026-11-09T15:00:00Z" });
    expect(verdict(room)).toEqual({ kind: "mid_vote" });
    expect(verdictText(room)).toBe("ברח באמצע ההצבעה");
  });
});
