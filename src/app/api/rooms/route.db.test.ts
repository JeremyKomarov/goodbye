import { afterAll, describe, expect, it, vi } from "vitest";

// Against the real database: `npm run test:db` loads .env.local. Plain `npm test` has no secret
// key in its environment, so this skips — and imports nothing that would demand one.
vi.mock("server-only", () => ({}));
const enabled = Boolean(process.env.SUPABASE_SECRET_KEY);

const DAY_MS = 86_400_000;
const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

const input = (overrides: Record<string, unknown> = {}) => ({
  hostName: "test:db",
  hostGender: "f",
  groupName: "test:db — delete me",
  reason: null,
  timezone: "Asia/Jerusalem",
  windowStart: isoDate(Date.now() + 2 * DAY_MS),
  days: 2,
  dayStartHour: 9,
  dayEndHour: 22,
  votingClosesAt: new Date(Date.now() + DAY_MS).toISOString(),
  locale: "en",
  ...overrides,
});

// Each run is its own caller to the limiter, so runs within the hour don't spend one budget.
const RUN_IP = `test-${crypto.randomUUID()}`;

const post = async (body: unknown, ip = RUN_IP) => {
  const { POST } = await import("./route");
  const request = new Request("http://test/api/rooms", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
  return POST(request);
};

describe.skipIf(!enabled)("POST /api/rooms against Supabase", () => {
  const created: string[] = [];

  afterAll(async () => {
    const { deleteRoom } = await import("@/server/db/rooms.repo");
    await Promise.all(created.map(deleteRoom));
  });

  it("writes the room and only the hash of the token it hands back", async () => {
    const response = await post(input());
    expect(response.status).toBe(201);
    const { CreatedRoomDtoSchema } = await import("@/features/landing/api/rooms.dto");
    const body = CreatedRoomDtoSchema.parse(await response.json());

    const { findAdminTokenHash, findRoomBySlug } = await import("@/server/db/rooms.repo");
    const room = await findRoomBySlug(body.slug);
    expect(room).not.toBeNull();
    created.push(room!.id);
    expect(room).toMatchObject({ groupName: "test:db — delete me", status: "voting", locale: "en" });
    expect(room!.windowEnd).toBe(isoDate(Date.now() + 3 * DAY_MS));

    const { tokenMatches } = await import("@/server/auth/admin-token");
    const hash = await findAdminTokenHash(room!.id);
    expect(hash).not.toBe(body.admin_token);
    expect(tokenMatches(body.admin_token, hash!)).toBe(true);
  });

  it("refuses a window with no hour left after voting closes", async () => {
    const response = await post(input({
      days: 1,
      votingClosesAt: new Date(Date.now() + 5 * DAY_MS).toISOString(),
    }));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error: { code: "no_slots_after_close", field: "votingClosesAt" },
    });
  });

  it("refuses a sixth room from one IP within the hour, before reading the body", async () => {
    const ip = `test-${crypto.randomUUID()}`;
    // Refused bodies still count, and write nothing to clean up.
    for (let attempt = 0; attempt < 5; attempt++) expect((await post(null, ip)).status).toBe(400);
    const limited = await post(input(), ip);
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: { code: "rate_limited" } });
  });
});
