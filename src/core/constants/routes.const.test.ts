import { describe, expect, it } from "vitest";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ROOM_SECTIONS, roomPath, roomSectionPath } from "./routes.const";

describe("roomPath", () => {
  it("fills the slug into a room-scoped route", () => {
    expect(roomPath(FEATURE_KEYS.room, "abc123")).toBe("/r/abc123");
    expect(roomPath(FEATURE_KEYS.admin, "abc123")).toBe("/r/abc123/admin");
  });

  it("encodes a slug it did not mint", () => {
    expect(roomPath(FEATURE_KEYS.room, "a/b")).toBe("/r/a%2Fb");
  });
});

describe("roomSectionPath", () => {
  it("is the room itself for the vote, and a segment below it for the wall", () => {
    expect(roomSectionPath("abc123", ROOM_SECTIONS.vote)).toBe("/r/abc123");
    expect(roomSectionPath("abc123", ROOM_SECTIONS.wall)).toBe("/r/abc123/wall");
  });
});
