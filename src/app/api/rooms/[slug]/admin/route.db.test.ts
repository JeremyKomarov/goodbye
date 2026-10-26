import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// The host's view against the real project (`npm run test:db`): only the admin token reads it,
// and it shows the players with their codes and whether they have voted. The room and the user are deleted afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const DAY_MS = 86_400_000;
const TOKEN = "a-token-of-at-least-twenty-characters";

describe.skipIf(!enabled)("the host's page against Supabase", { timeout: 20_000 }, () => {
  let slug = "";
  let roomId = "";
  let userId = "";
  let accessToken = "";
  let firstSlot = "";

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
        locale: "he",
      },
      hashToken(TOKEN),
    );
    slug = room.slug;
    roomId = room.id;
    const { allSlots } = await import("@/shared/utils/slots");
    firstSlot = new Date(allSlots(room)[0].ms).toISOString();
    const { testSession } = await import("@/server/db/test-sessions");
    ({ userId, token: accessToken } = await testSession());
    const { savePlayerName } = await import("@/server/db/players.repo");
    const { saveLoginCode } = await import("@/server/db/login-codes.repo");
    await savePlayerName(accessToken, roomId, userId, "Player");
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
      { user_id: userId, display_name: "Player", is_host: false, code: "ABC234", has_voted: false },
    ]);
  });

  it("says who has voted", async () => {
    const { saveVote } = await import("@/server/db/votes.repo");
    await saveVote(accessToken, roomId, userId, firstSlot);
    const body = await (await get(TOKEN)).json();
    expect(body.players).toEqual([expect.objectContaining({ user_id: userId, has_voted: true })]);
  });

  it("refuses no token and a wrong one alike", async () => {
    for (const token of [undefined, "a-wrong-token-of-twenty-characters"]) {
      const response = await get(token);
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({ error: { code: "forbidden" } });
    }
  });

  const act = async (body: unknown) => {
    const { PATCH } = await import("./route");
    const request = new Request("http://test", {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-token": TOKEN },
      body: JSON.stringify(body),
    });
    const response = await PATCH(request, { params: Promise.resolve({ slug }) });
    return { status: response.status, body: await response.json() };
  };

  it("locks, reopens, exits and takes the exit back", async () => {
    expect((await act({ action: "lock" })).body.status).toBe("locked");

    const past = await act({ action: "reopen", votingClosesAt: new Date().toISOString() });
    expect(past.status).toBe(422);
    expect(past.body.error).toEqual({ code: "close_time_in_past", field: "votingClosesAt" });
    const later = new Date(Date.now() + DAY_MS).toISOString();
    const reopened = await act({ action: "reopen", votingClosesAt: later });
    expect(reopened.body).toMatchObject({ status: "voting", locked_slot: null });

    const exited = await act({ action: "exit" });
    expect(exited.body.status).toBe("exited");
    const again = await act({ action: "exit" });
    expect(again.body.exited_at).toBe(exited.body.exited_at);
    expect((await act({ action: "undo_exit" })).body).toMatchObject({
      status: "voting",
      exited_at: null,
    });
  });

  it("deletes a goodbye from the wall", async () => {
    const { db } = await import("@/server/db/client");
    const { data } = await db()
      .from("wall_messages")
      .insert({ room_id: roomId, user_id: userId, display_name: "-", body: "delete me" })
      .select("id")
      .single<{ id: number }>();
    const { DELETE } = await import("./messages/[messageId]/route");
    const request = new Request("http://test", {
      method: "DELETE",
      headers: { "x-admin-token": TOKEN },
    });
    const params = Promise.resolve({ slug, messageId: String(data!.id) });
    expect((await DELETE(request, { params })).status).toBe(204);
    const { count } = await db()
      .from("wall_messages")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId);
    expect(count).toBe(0);
  });
});
