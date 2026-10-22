import { afterAll, describe, expect, it, vi } from "vitest";

// Login codes against the real project (`npm run test:db`): an anonymous user asks for a code,
// signs in with it as another device would, and replaces it. The user is deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);

describe.skipIf(!enabled)("POST /api/me/login-code against Supabase", { timeout: 20_000 }, () => {
  let userId = "";

  afterAll(async () => {
    const { db } = await import("@/server/db/client");
    if (userId) await db().auth.admin.deleteUser(userId);
  });

  async function browser() {
    const { createClient } = await import("@supabase/supabase-js");
    const { env } = await import("@/core/config/env");
    return createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: { persistSession: false },
    });
  }

  const ask = async (token: string, fresh = false) => {
    const { POST } = await import("./route");
    const request = new Request("http://test/api/me/login-code", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ fresh }),
    });
    return (await POST(request)).json() as Promise<{ code: string; created: boolean }>;
  };

  it("makes a code once, signs in with it elsewhere, and replaces it on request", async () => {
    const { loginEmail } = await import("@/core/constants/login.const");
    const first = await browser();
    const { data } = await first.auth.signInAnonymously();
    userId = data.user!.id;

    const made = await ask(data.session!.access_token);
    expect(made).toMatchObject({ created: true });
    expect(made.code).toMatch(/^[2-9A-HJKMNP-Z]{6}$/);

    const other = await browser();
    const signedIn = await other.auth.signInWithPassword({
      email: loginEmail(userId),
      password: made.code,
    });
    expect(signedIn.data.user?.id).toBe(userId);
    const token = signedIn.data.session!.access_token;

    expect(await ask(token)).toEqual({ code: made.code, created: false });
    const fresh = await ask(token, true);
    expect(fresh.created).toBe(true);
    expect(fresh.code).not.toBe(made.code);
  });
});
