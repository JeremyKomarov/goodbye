import { describe, expect, it } from "vitest";
import { isolate } from "./isolate";

describe("isolate", () => {
  it("wraps the text in first-strong and pop isolates", () => {
    expect(isolate("david")).toBe("⁨david⁩");
  });
});
