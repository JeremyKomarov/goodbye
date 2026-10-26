import { afterAll, describe, expect, it, vi } from "vitest";

// Against the real project (`npm run test:db`): a player's session (./test-sessions.ts — a test has
// no captcha token for the browser's own sign-in), then the server's check of the token. The user
// is deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);

describe.skipIf(!enabled)("players' sessions against Supabase", () => {
  let userId: string | undefined;

  afterAll(async () => {
    const { db } = await import("./client");
    if (userId) await db().auth.admin.deleteUser(userId);
  });

  it("accepts a player's token and rejects a made-up one", async () => {
    const { testSession } = await import("./test-sessions");
    const session = await testSession();
    userId = session.userId;

    const { userIdForAccessToken } = await import("./users.repo");
    expect(await userIdForAccessToken(session.token)).toBe(userId);
    expect(await userIdForAccessToken("not-a-token")).toBeNull();
  });
});
