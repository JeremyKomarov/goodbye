// The room's enums, shared by the landing wizard, the room screen and the server. The values are
// the database's (supabase/migrations/…_init.sql): its checks reject anything else.

export const HOST_GENDERS = { m: "m", f: "f" } as const;
export const LEAVE_REASONS = { fired: "fired", quit: "quit", fedUp: "fed_up" } as const;
export const ROOM_STATUSES = { voting: "voting", locked: "locked", exited: "exited" } as const;

export type HostGender = (typeof HOST_GENDERS)[keyof typeof HOST_GENDERS];
export type LeaveReason = (typeof LEAVE_REASONS)[keyof typeof LEAVE_REASONS];
export type RoomStatus = (typeof ROOM_STATUSES)[keyof typeof ROOM_STATUSES];
