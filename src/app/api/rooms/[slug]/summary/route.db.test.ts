import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// The exit summary against the real project (`npm run test:db`): the votes counted, the lead
// alone or tied, the goodbyes and the most loved one, and a tie the lock drew. Cleaned up after.
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

describe.skipIf(!enabled)("the exit summary against Supabase", { timeout: 30_000 }, () => {
  let slug = "";
  let roomId = "";
  let slots: number[] = [];
  const users: { token: string; userId: string }[] = [];

  beforeAll(async () => {
    const { insertRoom } = await import("@/server/db/rooms.repo");
    const day = new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10);
    const room = await insertRoom(
      {
        hostName: "test:db",
        hostGender: "m",
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
    const { allSlots } = await import("@/shared/utils/slots");
    slots = allSlots(room).map((slot) => slot.ms);
    users.push(await anonymous(), await anonymous(), await anonymous());
    const { savePlayerName } = await import("@/server/db/players.repo");
    await Promise.all(
      users.map((u, i) => savePlayerName(u.token, roomId, u.userId, `Player ${i + 1}`)),
    );
  });

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    const { db } = await import("@/server/db/client");
    if (roomId) await deleteRoom(roomId);
    await Promise.all(users.map((u) => db().auth.admin.deleteUser(u.userId)));
  });

  const read = async () => {
    const { GET } = await import("./route");
    return (await GET(new Request("http://test"), { params: Promise.resolve({ slug }) })).json();
  };
  const vote = async (user: number, slot: number) => {
    const { saveVote } = await import("@/server/db/votes.repo");
    const { token, userId } = users[user];
    await saveVote(token, roomId, userId, new Date(slots[slot]).toISOString());
  };

  it("is empty before anything happened", async () => {
    expect(await read()).toEqual({
      voter_count: 0,
      message_count: 0,
      loved: null,
      drawn: false,
      leading_slot: null,
    });
  });

  it("names the lead only while it is alone", async () => {
    await vote(0, 0);
    await vote(1, 1);
    expect(await read()).toMatchObject({ voter_count: 2, leading_slot: null });
    await vote(2, 1);
    expect(await read()).toMatchObject({
      voter_count: 3,
      leading_slot: new Date(slots[1]).toISOString(),
    });
  });

  it("counts the goodbyes and finds the most loved", async () => {
    const { insertWallMessage, saveReaction } = await import("@/server/db/wall.repo");
    const first = await insertWallMessage(users[0].token, roomId, "first");
    const second = await insertWallMessage(users[1].token, roomId, "second");
    const react = (user: number, messageId: number) =>
      saveReaction(users[user].token, { ...users[user], roomId, messageId, emoji: "❤️" });
    await react(1, first.id);
    await react(0, second.id);
    await react(2, second.id);
    expect(await read()).toMatchObject({
      message_count: 2,
      loved: { display_name: "Player 2", body: "second", reactions: 2 },
    });
  });

  it("says when the locked hour was drawn from a tie", async () => {
    const { withdrawVote } = await import("@/server/db/votes.repo");
    const { lockRoomNow } = await import("@/server/db/rooms.repo");
    await withdrawVote(users[2].token, roomId, users[2].userId);
    await lockRoomNow(roomId);
    expect(await read()).toMatchObject({ voter_count: 2, drawn: true, leading_slot: null });
  });
});
