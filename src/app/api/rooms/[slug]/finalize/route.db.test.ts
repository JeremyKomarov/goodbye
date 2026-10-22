import { afterAll, describe, expect, it, vi } from "vitest";

// Locking a room against the real project (`npm run test:db`). Cleaned up afterwards.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const DAY_MS = 86_400_000;

describe.skipIf(!enabled)("POST /api/rooms/[slug]/finalize against Supabase", () => {
  const rooms: string[] = [];

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    await Promise.all(rooms.map(deleteRoom));
  });

  async function roomClosingAt(closesAt: number) {
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
        votingClosesAt: new Date(closesAt).toISOString(),
      },
      "not-a-real-hash",
    );
    rooms.push(room.id);
    return room;
  }

  const finalize = async (slug: string) => {
    const { POST } = await import("./route");
    const response = await POST(new Request("http://test", { method: "POST" }), {
      params: Promise.resolve({ slug }),
    });
    return { status: response.status, body: await response.json() };
  };

  it("leaves an open room voting", async () => {
    const room = await roomClosingAt(Date.now() + DAY_MS);
    const { status, body } = await finalize(room.slug);
    expect(status).toBe(200);
    expect(body).toMatchObject({ status: "voting", locked_slot: null });
  });

  it("locks a closed room with no votes to its first hour, and keeps it there", async () => {
    const room = await roomClosingAt(Date.now() - 60_000);
    const { allSlots } = await import("@/shared/utils/slots");
    const first = await finalize(room.slug);
    expect(first.body.status).toBe("locked");
    expect(Date.parse(first.body.locked_slot)).toBe(allSlots(room)[0].ms);
    expect((await finalize(room.slug)).body.locked_slot).toBe(first.body.locked_slot);
  });

  it("answers not_found for an unknown room", async () => {
    expect((await finalize("zzzzzzzz")).status).toBe(404);
  });
});
