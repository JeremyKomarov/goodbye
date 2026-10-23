import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Scores against the real project (`npm run test:db`): a player's best per game under their
// name, a stranger and an impossible score refused, and the games closed once the host has left.
// Cleaned up afterwards.
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

describe.skipIf(!enabled)("scores against Supabase", { timeout: 20_000 }, () => {
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
    await savePlayerName(users[0].token, roomId, users[0].userId, "Gamer");
  });

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    const { db } = await import("@/server/db/client");
    if (roomId) await deleteRoom(roomId);
    await Promise.all(users.map((u) => db().auth.admin.deleteUser(u.userId)));
  });

  const submit = async (user: { token: string }, body: unknown) => {
    const { POST } = await import("./route");
    const request = new Request(`http://test/api/rooms/${slug}/scores`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${user.token}` },
      body: JSON.stringify(body),
    });
    return POST(request, { params: Promise.resolve({ slug }) });
  };

  const read = async () => {
    const { GET } = await import("./route");
    return (await GET(new Request("http://test"), { params: Promise.resolve({ slug }) })).json();
  };

  it("keeps each player's best, lowest for a timed game", async () => {
    expect((await submit(users[0], { game: "runaway", score: 4000 })).status).toBe(204);
    expect((await submit(users[0], { game: "runaway", score: 2500 })).status).toBe(204);
    expect((await submit(users[0], { game: "trivia", score: 300 })).status).toBe(204);
    expect((await submit(users[0], { game: "trivia", score: 200 })).status).toBe(204);
    const { records } = await read();
    expect(records).toHaveLength(2);
    expect(records).toEqual(
      expect.arrayContaining([
        { game: "runaway", user_id: users[0].userId, display_name: "Gamer", score: 2500 },
        { game: "trivia", user_id: users[0].userId, display_name: "Gamer", score: 300 },
      ]),
    );
  });

  it("refuses someone who never joined, and a score the game can't make", async () => {
    expect((await submit(users[1], { game: "catch", score: 10 })).status).toBe(403);
    const impossible = await submit(users[0], { game: "runaway", score: 100 });
    expect(impossible.status).toBe(400);
    expect(await impossible.json()).toEqual({ error: { code: "invalid_input", field: "score" } });
  });

  it("closes the games once the host has left", async () => {
    const { markExited } = await import("@/server/db/rooms.repo");
    await markExited(roomId);
    const response = await submit(users[0], { game: "catch", score: 10 });
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: { code: "games_closed" } });
  });
});
