import { describe, expect, it } from "vitest";
import { matches, normalize } from "./answers";

describe("answers", () => {
  it("normalizes case, punctuation, niqqud and final letters", () => {
    expect(normalize("  Ice-Cream! ")).toBe("ice cream");
    expect(normalize("שָׁלוֹם")).toBe("שלומ");
  });

  it("matches with or without the article, spaces or a small typo", () => {
    expect(matches("הבננה", ["בננה"])).toBe(true);
    expect(matches("icecream", ["ice cream"])).toBe(true);
    expect(matches("pengiun", ["penguin"])).toBe(true);
    expect(matches("טלויזיה", ["טלוויזיה"])).toBe(true);
  });

  it("refuses a different thing, and forgives nothing in a short word", () => {
    expect(matches("רכבת", ["בננה"])).toBe(false);
    expect(matches("cat", ["car"])).toBe(false);
    expect(matches("   ", ["car"])).toBe(false);
  });
});
