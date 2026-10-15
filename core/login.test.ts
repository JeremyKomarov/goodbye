import { describe, expect, it } from "vitest";
import { loginEmail, normalizeCode, sameName } from "@/core/login";

describe("login codes", () => {
  it("reads a code however it was typed", () => {
    expect(normalizeCode(" k7p 2qx ")).toBe("K7P2QX");
    expect(normalizeCode("K7P-2QX")).toBe("K7P2QX");
  });

  it("uses an address that can't receive mail", () => {
    expect(loginEmail("abc")).toBe("abc@players.invalid");
  });

  it("matches names like the database does", () => {
    expect(sameName("  Dana   Levi ", "dana levi")).toBe(true);
    expect(sameName("דני", "דנה")).toBe(false);
  });
});
