import { describe, expect, it } from "vitest";
import { LOGIN_CODE_ALPHABET, loginEmail, normalizeLoginCode } from "./login.const";

describe("login codes", () => {
  it("reads a code however it was typed", () => {
    expect(normalizeLoginCode(" k7p 2qx ")).toBe("K7P2QX");
    expect(normalizeLoginCode("k7p-2qx")).toBe("K7P2QX");
  });

  it("puts the login behind an address that can't receive mail", () => {
    expect(loginEmail("u1")).toBe("u1@players.invalid");
  });

  it("leaves out the characters that read alike", () => {
    expect(LOGIN_CODE_ALPHABET).not.toMatch(/[01OIL]/);
  });
});
