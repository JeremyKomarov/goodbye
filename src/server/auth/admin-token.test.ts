import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { hashToken, newAdminToken, tokenMatches } = await import("./admin-token");

describe("admin token", () => {
  it("is long, URL-safe and different every time", () => {
    const token = newAdminToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{32}$/);
    expect(newAdminToken()).not.toBe(token);
  });

  it("matches its own hash and nothing else", () => {
    const token = newAdminToken();
    const hash = hashToken(token);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenMatches(token, hash)).toBe(true);
    expect(tokenMatches(newAdminToken(), hash)).toBe(false);
  });

  it("rejects a malformed stored hash instead of throwing", () => {
    expect(tokenMatches(newAdminToken(), "not-hex")).toBe(false);
  });
});
