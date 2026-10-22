import { describe, expect, it } from "vitest";
import { sameName } from "./names";

describe("sameName", () => {
  it("ignores case and extra spaces, like norm_name() in SQL", () => {
    expect(sameName("  Dana   Levi ", "dana levi")).toBe(true);
    expect(sameName("דנה", "דנה ")).toBe(true);
  });

  it("still tells different names apart", () => {
    expect(sameName("Dana", "Dan")).toBe(false);
  });
});
