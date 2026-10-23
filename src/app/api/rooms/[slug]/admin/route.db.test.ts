import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// The host's view against the real project (`npm run test:db`): only the admin token reads it,
// and it shows the players with their codes. The room and the user are deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const DAY_MS = 86_400_000;
const TOKEN = "a-token-of-at-least-twenty-characters";

describe.skipIf(!enabled)("GET /api/rooms/[slug]/admin against Supabase", { timeout: 20_000 }, () => {
  let slug = "";
  let roomId = "";
  let userId = "";

  beforeAll(async () => {
    const { insertRoom } = await import("@/server/db/rooms.repo");
    const { hashToken } = await import("@/server/auth/admin-token");
    const day = new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10);
    const room = await insertRoom(
      {
        hostName: "test:db",
        hostGender: "f",
        groupName: "test:db — delete me",
        reason: null,
        timezone: "Asia/Jerusalem",
        windowStart: day,
        windowEnd: day,
        dayStartHour: 9,
        dayEndHour: 22,
        votingClosesAt: new Date(Date.now() + DAY_MS).toISOString(),
      },
      hashToken(TOKEN),
    );
    slug = room.slug;
    roomId = room.id;
    const { createClient } = await import("@supabase/supabase-js");
    const { env } = await import("@/core/config/env");
    const browser = createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: { persistSession: false },
    });
    const { data } = await browser.auth.signInAnonymously();
    userId = data.user!.id;
    const { savePlayerName } = await import("@/server/db/players.repo");
    const { saveLoginCode } = await import("@/server/db/login-codes.repo");
    await savePlayerName(data.session!.access_token, roomId, userId, "Player");
    await saveLoginCode(userId, "ABC234");
  });

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    const { db } = await import("@/server/db/client");
    if (roomId) await deleteRoom(roomId);
    if (userId) await db().auth.admin.deleteUser(userId);
  });

  const get = async (token?: string) => {
    const { GET } = await import("./route");
    const headers: Record<string, string> = token ? { "x-admin-token": token } : {};
    return GET(new Request("http://test", { headers }), { params: Promise.resolve({ slug }) });
  };

  it("shows the host the players and their codes", async () => {
    const response = await get(TOKEN);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.room.slug).toBe(slug);
    expect(body.players).toEqual([
      { user_id: userId, display_name: "Player", is_host: false, code: "ABC234" },
    ]);
  });

  it("refuses no token and a wrong one alike", async () => {
    for (const token of [undefined, "a-wrong-token-of-twenty-characters"]) {
      const response = await get(token);
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({ error: { code: "forbidden" } });
    }
  });
});
