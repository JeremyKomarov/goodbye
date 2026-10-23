import { afterAll, describe, expect, it, vi } from "vitest";

// Against the real database (`npm run test:db`); skips without a secret key, like ../route.db.test.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);
const DAY_MS = 86_400_000;

const get = async (slug: string) => {
  const { GET } = await import("./route");
  const request = new Request(`http://test/api/rooms/${slug}`);
  return GET(request, { params: Promise.resolve({ slug }) });
};

describe.skipIf(!enabled)("GET /api/rooms/[slug] against Supabase", () => {
  const created: string[] = [];

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    await Promise.all(created.map(deleteRoom));
  });

  it("answers the room with no players, hosts or votes yet", async () => {
    const { insertRoom } = await import("@/server/db/rooms.repo");
    const room = await insertRoom(
      {
        hostName: "test:db",
        hostGender: "m",
        groupName: "test:db — delete me",
        reason: null,
        timezone: "Asia/Jerusalem",
        windowStart: new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10),
        windowEnd: new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10),
        dayStartHour: 9,
        dayEndHour: 22,
        votingClosesAt: new Date(Date.now() + DAY_MS).toISOString(),
        locale: "he",
      },
      "not-a-real-hash",
    );
    created.push(room.id);

    const response = await get(room.slug);
    expect(response.status).toBe(200);
    const { RoomSnapshotDtoSchema } = await import("@/features/room/api/room.dto");
    const body = RoomSnapshotDtoSchema.parse(await response.json());
    expect(body.room.slug).toBe(room.slug);
    expect(body).toMatchObject({ players: [], host_ids: [], votes: [] });
  });

  it("answers not_found for an unknown or malformed slug", async () => {
    for (const slug of ["zzzzzzzz", "../etc"]) {
      const response = await get(slug);
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: { code: "not_found" } });
    }
  });
});
