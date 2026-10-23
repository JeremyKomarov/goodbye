import { describe, expect, it } from "vitest";
import { AdminRoomDtoSchema } from "./admin.dto";
import { mapAdminRoomDto } from "./admin.mapper";

const dto = AdminRoomDtoSchema.parse({
  room: {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "abc12345",
    host_name: "Jeremy",
    host_gender: "m",
    group_name: "Product team",
    reason: "quit",
    timezone: "Asia/Jerusalem",
    window_start: "2026-11-10",
    window_end: "2026-11-10",
    day_start_hour: 9,
    day_end_hour: 22,
    voting_closes_at: "2026-11-09T18:00:00.000Z",
    status: "voting",
    locked_slot: null,
    exited_at: null,
  },
  players: [
    { user_id: "u0", display_name: "Jeremy", is_host: true, code: null, has_voted: false },
    { user_id: "u1", display_name: "Dana", is_host: false, code: "ABC234", has_voted: true },
  ],
  messages: [{ id: 7, display_name: "Dana", body: "bye!", created_at: "2026-11-10T09:00:00.000Z" }],
});

describe("mapAdminRoomDto", () => {
  it("carries each player's code and vote, and the host flag", () => {
    expect(mapAdminRoomDto(dto).players).toEqual([
      { userId: "u0", name: "Jeremy", isHost: true, code: null, hasVoted: false },
      { userId: "u1", name: "Dana", isHost: false, code: "ABC234", hasVoted: true },
    ]);
  });

  it("turns a goodbye's time into milliseconds", () => {
    expect(mapAdminRoomDto(dto).messages[0]).toEqual({
      id: 7,
      name: "Dana",
      body: "bye!",
      createdAt: Date.parse("2026-11-10T09:00:00.000Z"),
    });
  });
});
