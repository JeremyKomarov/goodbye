import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Joining against the real project (`npm run test:db`): two anonymous users and a host, through
// the handlers, with the database's own name rules. The room and the users are deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const DAY_MS = 86_400_000;

async function anonymousToken() {
  const { createClient } = await import("@supabase/supabase-js");
  const { env } = await import("@/core/config/env");
  const client = createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: false },
  });
  const { data } = await client.auth.signInAnonymously();
  return { token: data.session!.access_token, userId: data.user!.id };
}

const call = (url: string, method: string, token: string, body: unknown) =>
  new Request(url, {
    method,
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

describe.skipIf(!enabled)("joining a room against Supabase", { timeout: 20_000 }, () => {
  let slug = "";
  let roomId = "";
  const adminToken = "admin-token-for-test-db";
  const users: { token: string; userId: string }[] = [];

  beforeAll(async () => {
    const { insertRoom } = await import("@/server/db/rooms.repo");
    const { hashToken } = await import("@/server/auth/admin-token");
    const day = new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10);
    const room = await insertRoom(
      {
        hostName: "Host Test",
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
      hashToken(adminToken),
    );
    slug = room.slug;
    roomId = room.id;
    for (let i = 0; i < 3; i++) users.push(await anonymousToken());
  });

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    const { db } = await import("@/server/db/client");
    if (roomId) await deleteRoom(roomId);
    await Promise.all(users.map((u) => db().auth.admin.deleteUser(u.userId)));
  });

  const join = async (user: { token: string }, name: string) => {
    const { PUT } = await import("./route");
    const request = call(`http://test/api/rooms/${slug}/me`, "PUT", user.token, { name });
    return PUT(request, { params: Promise.resolve({ slug }) });
  };

  const claim = async (user: { token: string }, token: string) => {
    const { POST } = await import("../hosts/route");
    const request = call(`http://test/api/rooms/${slug}/hosts`, "POST", user.token, {
      adminToken: token,
    });
    return POST(request, { params: Promise.resolve({ slug }) });
  };

  it("lets a player in, and renames them on a second call", async () => {
    expect((await join(users[0], "Dana")).status).toBe(204);
    expect((await join(users[0], "Dana L")).status).toBe(204);
  });

  it("refuses a name someone has, however it is spaced or cased", async () => {
    const response = await join(users[1], "  dana   l ");
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: { code: "name_taken", field: "name" } });
  });

  it("keeps the host's name for the host", async () => {
    expect((await join(users[1], "Host Test")).status).toBe(409);
    expect((await claim(users[2], "wrong")).status).toBe(403);
    expect((await claim(users[2], adminToken)).status).toBe(204);
    expect((await claim(users[2], adminToken)).status).toBe(204);
    expect((await join(users[2], "Host Test")).status).toBe(204);
  });

  it("refuses a caller with no session", async () => {
    const { PUT } = await import("./route");
    const request = new Request(`http://test/api/rooms/${slug}/me`, {
      method: "PUT",
      body: JSON.stringify({ name: "Nobody" }),
    });
    expect((await PUT(request, { params: Promise.resolve({ slug }) })).status).toBe(401);
  });

  it("shows the players and the host in the room", async () => {
    const { GET } = await import("../route");
    const response = await GET(new Request(`http://test/api/rooms/${slug}`), {
      params: Promise.resolve({ slug }),
    });
    const body = await response.json();
    expect(body.players.map((p: { display_name: string }) => p.display_name).sort()).toEqual([
      "Dana L",
      "Host Test",
    ]);
    expect(body.host_ids).toEqual([users[2].userId]);
  });
});
