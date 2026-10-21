import { afterEach, describe, expect, it, vi } from "vitest";

const VALID = {
  supabaseUrl: "https://example.supabase.co",
  supabasePublishableKey: "sb_publishable_x",
  siteUrl: "https://goodbye.example/",
};

describe("parsePublicEnv", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", VALID.supabaseUrl);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", VALID.supabasePublishableKey);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", VALID.siteUrl);
  const { parsePublicEnv } = await import("./env");

  afterEach(() => vi.unstubAllEnvs());

  it("trims the trailing slash and defaults mocks off", () => {
    const env = parsePublicEnv(VALID);
    expect(env.siteUrl).toBe("https://goodbye.example");
    expect(env.useMocks).toBe(false);
  });

  it("fails loudly on a missing key", () => {
    expect(() => parsePublicEnv({ ...VALID, supabaseUrl: undefined })).toThrow();
  });

  it("refuses mocks in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => parsePublicEnv({ ...VALID, useMocks: "true" })).toThrow(/production/);
  });

  it("allows mocks outside production", () => {
    expect(parsePublicEnv({ ...VALID, useMocks: "true" }).useMocks).toBe(true);
  });
});
