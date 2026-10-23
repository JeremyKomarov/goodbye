import { FEATURE_KEYS, FEATURES, type FeatureKey } from "@/core/config/features.const";
import type { GameId } from "@/core/constants/games.const";

// Derived from the registry, never restated (04-FEATURES.md §1). A room route is a pattern; build
// a real path with `roomPath`.
export const ROUTES = Object.fromEntries(
  Object.entries(FEATURES).map(([key, feature]) => [key, feature.route]),
) as Record<FeatureKey, string>;

const SLUG = "[slug]";

/** A room-scoped route with its slug filled in: `roomPath(FEATURE_KEYS.admin, "abc")`. */
export function roomPath(key: FeatureKey, slug: string): string {
  return ROUTES[key].replace(SLUG, encodeURIComponent(slug));
}

/** The room's sections below its own route: the vote is the room itself, the rest beside it. */
export const ROOM_SECTIONS = { vote: "", wall: "wall", games: "games" } as const;
export type RoomSection = (typeof ROOM_SECTIONS)[keyof typeof ROOM_SECTIONS];

/** A section of the room: `roomSectionPath("abc", ROOM_SECTIONS.wall)` → `/r/abc/wall`. */
export function roomSectionPath(slug: string, section: RoomSection): string {
  const room = roomPath(FEATURE_KEYS.room, slug);
  return section ? `${room}/${section}` : room;
}

/** One game, under the games: `roomGamePath("abc", "trivia")` → `/r/abc/games/trivia`. */
export function roomGamePath(slug: string, game: GameId): string {
  return `${roomSectionPath(slug, ROOM_SECTIONS.games)}/${game}`;
}

/** The admin link carries the token in its hash, `#k=…`, so it never reaches a server log. */
export const ADMIN_TOKEN_PARAM = "k";
