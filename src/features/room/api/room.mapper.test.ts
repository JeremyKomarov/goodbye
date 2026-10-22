import { describe, expect, it } from "vitest";
import { RoomSnapshotDtoSchema } from "./room.dto";
import { mapRoomSnapshotDto } from "./room.mapper";

const dto = RoomSnapshotDtoSchema.parse({
  room: {
    id: "r1",
    slug: "abc23456",
    host_name: "Dana",
    host_gender: "f",
    group_name: "Work",
    reason: "fed_up",
    timezone: "Asia/Jerusalem",
    window_start: "2026-10-24",
    window_end: "2026-10-25",
    day_start_hour: 9,
    day_end_hour: 22,
    voting_closes_at: "2026-10-23T18:00:00+00:00",
    status: "locked",
    locked_slot: "2026-10-24T09:00:00+00:00",
    exited_at: null,
  },
  players: [{ user_id: "u1", display_name: "Yossi" }],
  host_ids: ["u0"],
  votes: [{ user_id: "u1", slot_start: "2026-10-24T09:00:00+00:00" }],
});

describe("mapRoomSnapshotDto", () => {
  it("turns the wire's times into epoch milliseconds and its names into camelCase", () => {
    const snapshot = mapRoomSnapshotDto(dto);
    expect(snapshot.room).toMatchObject({
      hostName: "Dana",
      windowStart: "2026-10-24",
      votingClosesAt: Date.UTC(2026, 9, 23, 18),
      lockedSlot: Date.UTC(2026, 9, 24, 9),
      exitedAt: null,
    });
    expect(snapshot.players).toEqual([{ userId: "u1", name: "Yossi" }]);
    expect(snapshot.votes).toEqual([{ userId: "u1", slotMs: Date.UTC(2026, 9, 24, 9) }]);
    expect(snapshot.hostIds).toEqual(["u0"]);
  });
});
