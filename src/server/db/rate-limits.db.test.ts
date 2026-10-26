import { afterAll, describe, expect, it, vi } from "vitest";

// Against the real project (`npm run test:db`): `hit_rate_limit()` counts a key within its window
// and refuses the hit past `max`. The test's key is deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const key = `test:${crypto.randomUUID()}`;

describe.skipIf(!enabled)("hit_rate_limit against Supabase", () => {
  afterAll(async () => {
    const { db } = await import("./client");
    await db().from("rate_limits").delete().eq("key", key);
  });

  it("passes the first max hits and refuses the next", async () => {
    const { hitRateLimit } = await import("./rate-limits.repo");
    const answers = [];
    for (let hit = 0; hit < 3; hit++) answers.push(await hitRateLimit(key, 3600, 2));
    expect(answers).toEqual([true, true, false]);
  });

  it("can't be called by a client role", async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const { env } = await import("@/core/config/env");
    const anon = createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: { persistSession: false },
    });
    const { error } = await anon.rpc("hit_rate_limit", {
      p_key: key, p_window_seconds: 3600, p_max: 100,
    });
    expect(error).not.toBeNull();
  });
});
