// The room's enums, shared by the landing wizard, the room screen and the server. The values are
// the database's (supabase/migrations/…_init.sql): its checks reject anything else.

export const HOST_GENDERS = { m: "m", f: "f" } as const;
export const LEAVE_REASONS = { fired: "fired", quit: "quit", fedUp: "fed_up" } as const;
export const ROOM_STATUSES = { voting: "voting", locked: "locked", exited: "exited" } as const;

/** The reactions a wall message can get, in picker order — the database's check allows these. */
export const REACTION_EMOJIS = ["❤️", "😂", "😢", "🫡", "👏", "🔥"] as const;

export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];
/** Voting stays open at least this long — for the link to reach the group, or after a reopening. */
export const MIN_OPEN_MS = 60_000;

export type HostGender = (typeof HOST_GENDERS)[keyof typeof HOST_GENDERS];
export type LeaveReason = (typeof LEAVE_REASONS)[keyof typeof LEAVE_REASONS];
export type RoomStatus = (typeof ROOM_STATUSES)[keyof typeof ROOM_STATUSES];
