import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// The wall against the real project (`npm run test:db`): a player posts and reacts, a stranger
// can't, the 3-second spacing holds, and the wall reads it all back. Cleaned up afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const DAY_MS = 86_400_000;

async function anonymous() {
  const { createClient } = await import("@supabase/supabase-js");
  const { env } = await import("@/core/config/env");
  const client = createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: false },
  });
  const { data } = await client.auth.signInAnonymously();
  return { token: data.session!.access_token, userId: data.user!.id };
}

const call = (url: string, method: string, token: string, body?: unknown) =>
  new Request(url, {
    method,
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

describe.skipIf(!enabled)("the wall against Supabase", { timeout: 20_000 }, () => {
  let slug = "";
  let roomId = "";
  const users: { token: string; userId: string }[] = [];

  beforeAll(async () => {
    const { insertRoom } = await import("@/server/db/rooms.repo");
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
        locale: "he",
      },
      "not-a-real-hash",
    );
    slug = room.slug;
    roomId = room.id;
    users.push(await anonymous(), await anonymous());
    const { savePlayerName } = await import("@/server/db/players.repo");
    await savePlayerName(users[0].token, roomId, users[0].userId, "Poster");
  });

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    const { db } = await import("@/server/db/client");
    if (roomId) await deleteRoom(roomId);
    await Promise.all(users.map((u) => db().auth.admin.deleteUser(u.userId)));
  });

  const post = async (user: { token: string }, body: string) => {
    const { POST } = await import("./route");
    const request = call(`http://test/api/rooms/${slug}/wall`, "POST", user.token, { body });
    return POST(request, { params: Promise.resolve({ slug }) });
  };

  it("posts under the player's own name, and spaces messages out", async () => {
    const response = await post(users[0], "  goodbye!  ");
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ display_name: "Poster", body: "goodbye!" });
    const again = await post(users[0], "and again");
    expect(again.status).toBe(429);
    expect(await again.json()).toEqual({ error: { code: "too_fast" } });
  });

  it("refuses someone who never joined", async () => {
    expect((await post(users[1], "hi")).status).toBe(403);
  });

  it("reacts, refuses a stranger's reaction, and reads it all back", async () => {
    const { GET } = await import("./route");
    const read = async () =>
      (await GET(new Request("http://test"), { params: Promise.resolve({ slug }) })).json();
    const [message] = (await read()).messages;
    const { PUT } = await import("./[messageId]/reaction/route");
    const reactAs = (user: { token: string }) =>
      PUT(call("http://test", "PUT", user.token, { emoji: "❤️" }), {
        params: Promise.resolve({ slug, messageId: String(message.id) }),
      });
    expect((await reactAs(users[0])).status).toBe(204);
    expect((await reactAs(users[1])).status).toBe(403);
    expect((await read()).reactions).toEqual([
      { message_id: message.id, user_id: users[0].userId, emoji: "❤️" },
    ]);
  });
});
