import { describe, expect, it } from "vitest";
import { LEAVE_REASONS } from "@/core/constants/room.const";
import { ROOM_THEMES, roomTheme } from "./roomTheme";

describe("roomTheme", () => {
  it("is the reason, so strings select on it the same way", () => {
    expect(roomTheme(LEAVE_REASONS.fired)).toBe(ROOM_THEMES.fired);
    expect(roomTheme(LEAVE_REASONS.quit)).toBe(ROOM_THEMES.quit);
    expect(roomTheme(LEAVE_REASONS.fedUp)).toBe(ROOM_THEMES.fedUp);
  });

  it("keeps WhatsApp's own look for a room with no reason", () => {
    expect(roomTheme(null)).toBe(ROOM_THEMES.classic);
  });
});
