import { describe, expect, it } from "vitest";
import { initialOf, senderColor } from "./avatar";

describe("senderColor", () => {
  it("gives an id the same sender colour every time", () => {
    expect(senderColor("user-1")).toBe(senderColor("user-1"));
    expect(senderColor("user-1")).toMatch(/^var\(--sender-[a-z]+\)$/);
  });
});

describe("initialOf", () => {
  it("is the first character, trimmed, and never half a surrogate pair", () => {
    expect(initialOf("  דנה")).toBe("ד");
    expect(initialOf("🚀 crew")).toBe("🚀");
    expect(initialOf("   ")).toBe("?");
  });
});
