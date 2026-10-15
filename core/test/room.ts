import type { Room } from "@/core/types";

/** A room in Israel, open 9:00–22:00 for two days in November (no DST change). */
export function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "abc12345",
    host_name: "ג׳רמי",
    host_gender: "m",
    group_name: "צוות מוצר",
    reason: null,
    timezone: "Asia/Jerusalem",
    window_start: "2026-11-10",
    window_end: "2026-11-11",
    day_start_hour: 9,
    day_end_hour: 22,
    voting_closes_at: "2026-11-09T18:00:00Z",
    status: "voting",
    locked_slot: null,
    exited_at: null,
    created_at: "2026-11-09T10:00:00Z",
    ...overrides,
  };
}
