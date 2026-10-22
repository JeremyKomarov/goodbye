import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Voting against the real project (`npm run test:db`): a player and the host, through the handlers,
// with the window's rules here and can_vote()/is_voter() in the database. Cleaned up afterwards.
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

const request = (url: string, method: string, token: string, body?: unknown) =>
  new Request(url, {
    method,
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

describe.skipIf(!enabled)("voting against Supabase", { timeout: 20_000 }, () => {
  const rooms: string[] = [];
  const users: { token: string; userId: string }[] = [];
  let open = "";
  let closed = "";
  let firstSlot = 0;

  async function makeRoom(closesAt: number) {
    const { insertRoom } = await import("@/server/db/rooms.repo");
    const { hashToken } = await import("@/server/auth/admin-token");
    const day = new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10);
    const room = await insertRoom(
      {
        hostName: "Host Vote",
        hostGender: "m",
        groupName: "test:db — delete me",
        reason: null,
        timezone: "Asia/Jerusalem",
        windowStart: day,
        windowEnd: day,
        dayStartHour: 9,
        dayEndHour: 22,
        votingClosesAt: new Date(closesAt).toISOString(),
      },
      hashToken("vote-test-token"),
    );
    rooms.push(room.id);
    return room;
  }

  beforeAll(async () => {
    const room = await makeRoom(Date.now() + DAY_MS);
    open = room.slug;
    closed = (await makeRoom(Date.now() - 60_000)).slug;
    const { allSlots } = await import("@/shared/utils/slots");
    firstSlot = allSlots(room)[0].ms;
    users.push(await anonymous(), await anonymous());

    const { savePlayerName } = await import("@/server/db/players.repo");
    const { addHost } = await import("@/server/db/hosts.repo");
    await savePlayerName(users[0].token, room.id, users[0].userId, "Voter");
    await addHost(room.id, users[1].userId);
    await savePlayerName(users[1].token, room.id, users[1].userId, "Host Vote");
  });

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    const { db } = await import("@/server/db/client");
    await Promise.all(rooms.map(deleteRoom));
    await Promise.all(users.map((u) => db().auth.admin.deleteUser(u.userId)));
  });

  const put = async (slug: string, user: { token: string }, slotMs: number) => {
    const { PUT } = await import("./route");
    const body = { slotStart: new Date(slotMs).toISOString() };
    return PUT(request(`http://test/api/rooms/${slug}/vote`, "PUT", user.token, body), {
      params: Promise.resolve({ slug }),
    });
  };

  const votes = async () => {
    const { GET } = await import("../route");
    const params = Promise.resolve({ slug: open });
    const response = await GET(new Request("http://test"), { params });
    return (await response.json()).votes as { user_id: string; slot_start: string }[];
  };

  it("casts a vote, then moves it", async () => {
    expect((await put(open, users[0], firstSlot)).status).toBe(204);
    expect((await put(open, users[0], firstSlot + 3_600_000)).status).toBe(204);
    const cast = await votes();
    expect(cast).toHaveLength(1);
    expect(Date.parse(cast[0].slot_start)).toBe(firstSlot + 3_600_000);
  });

  it("refuses an hour outside the window, or off the hour", async () => {
    for (const slotMs of [firstSlot - 3_600_000, firstSlot + 60_000]) {
      const response = await put(open, users[0], slotMs);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: { code: "invalid_input", field: "slotStart" } });
    }
  });

  it("refuses the host", async () => {
    expect((await put(open, users[1], firstSlot)).status).toBe(403);
  });

  it("refuses once voting has closed", async () => {
    const response = await put(closed, users[0], firstSlot);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: { code: "voting_closed" } });
  });

  it("takes a vote back", async () => {
    const { DELETE } = await import("./route");
    const response = await DELETE(
      request(`http://test/api/rooms/${open}/vote`, "DELETE", users[0].token),
      { params: Promise.resolve({ slug: open }) },
    );
    expect(response.status).toBe(204);
    expect(await votes()).toEqual([]);
  });
});
