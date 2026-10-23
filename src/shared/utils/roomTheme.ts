import { LEAVE_REASONS, type LeaveReason } from "@/core/constants/room.const";

// A room's theme is its host's reason for leaving: it picks the stories, the words and the emoji;
// a room with no reason gets the classic ones. The colours are the same for every theme. The
// values are the reasons', so a string can `select` on a theme the way it does on a reason.

export const ROOM_THEMES = {
  classic: "classic",
  fired: LEAVE_REASONS.fired,
  quit: LEAVE_REASONS.quit,
  fedUp: LEAVE_REASONS.fedUp,
} as const;

export type RoomTheme = (typeof ROOM_THEMES)[keyof typeof ROOM_THEMES];

export function roomTheme(reason: LeaveReason | null): RoomTheme {
  return reason ?? ROOM_THEMES.classic;
}
