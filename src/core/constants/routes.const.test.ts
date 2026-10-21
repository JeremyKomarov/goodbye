import { describe, expect, it } from "vitest";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { roomPath } from "./routes.const";

describe("roomPath", () => {
  it("fills the slug into a room-scoped route", () => {
    expect(roomPath(FEATURE_KEYS.room, "abc123")).toBe("/r/abc123");
    expect(roomPath(FEATURE_KEYS.admin, "abc123")).toBe("/r/abc123/admin");
  });

  it("encodes a slug it did not mint", () => {
    expect(roomPath(FEATURE_KEYS.room, "a/b")).toBe("/r/a%2Fb");
  });
});
