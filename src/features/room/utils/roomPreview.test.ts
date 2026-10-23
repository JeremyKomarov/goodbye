import { describe, expect, it } from "vitest";
import type { Room } from "@/shared/types/room.types";
import { roomPreview } from "./roomPreview";

const locked = Date.parse("2026-11-10T16:00:00Z");
const room: Room = {
  id: "room-1",
  slug: "abc12345",
  hostName: "דנה",
  hostGender: "f",
  groupName: "צוות מוצר",
  reason: null,
  timezone: "Asia/Jerusalem",
  windowStart: "2026-11-10",
  windowEnd: "2026-11-10",
  dayStartHour: 9,
  dayEndHour: 22,
  votingClosesAt: locked - 86_400_000,
  status: "voting",
  lockedSlot: null,
  exitedAt: null,
};

describe("roomPreview", () => {
  it("asks the question while the group votes", () => {
    const preview = roomPreview(room, "he");
    expect(preview.title).toBe("מתי דנה יוצאת מצוות מוצר?");
    expect(preview.card.lines).toEqual(["מתי דנה יוצאת", "מצוות מוצר?"]);
  });

  it("tells the decision once the hour is locked, in the room's timezone", () => {
    const preview = roomPreview({ ...room, status: "locked", lockedSlot: locked }, "en");
    expect(preview.title).toBe("דנה leaves צוות מוצר Tue 11/10 at 18:00");
    expect(preview.card.lines).toEqual(["דנה leaves", "Tue 11/10 at 18:00"]);
  });

  it("gives the verdict once the host has left", () => {
    const exitedAt = locked + 25 * 60_000;
    const preview = roomPreview({ ...room, status: "exited", lockedSlot: locked, exitedAt }, "he");
    expect(preview.title).toBe("דנה יצאה מצוות מוצר: איחרה ב-25 דקות");
    expect(preview.card.lines).toEqual(["ביי דנה", "איחרה ב-25 דקות"]);
  });

  it("cuts a long name on the card, never in the title", () => {
    const long = { ...room, hostName: "Bartholomew-Alexander" };
    expect(roomPreview(long, "en").card.lines[0]).toBe("When does Bartholomew-Al");
    expect(roomPreview(long, "en").title).toContain("Bartholomew-Alexander");
  });

  it("says so for a room that is gone", () => {
    expect(roomPreview(null, "he")).toMatchObject({ title: "החדר לא נמצא", description: null });
  });
});
