import { afterAll, describe, expect, it, vi } from "vitest";

// Against the real project (`npm run test:db`): anonymous sign-in, as the browser does it, then the
// server's check of the token. The user is deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);

describe.skipIf(!enabled)("anonymous sessions against Supabase", () => {
  let userId: string | undefined;

  afterAll(async () => {
    const { db } = await import("./client");
    if (userId) await db().auth.admin.deleteUser(userId);
  });

  it("accepts an anonymous user's token and rejects a made-up one", async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const { env } = await import("@/core/config/env");
    const browser = createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await browser.auth.signInAnonymously();
    expect(error).toBeNull();
    userId = data.user?.id;

    const { userIdForAccessToken } = await import("./users.repo");
    expect(await userIdForAccessToken(data.session!.access_token)).toBe(userId);
    expect(await userIdForAccessToken("not-a-token")).toBeNull();
  });
});
