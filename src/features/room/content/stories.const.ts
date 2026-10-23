// The status stories: groups of facts, shown like WhatsApp statuses. The words are the `stories`
// namespace's (StatusStories.strings.ts); here is each group's look and its facts' keys, and which
// groups a room shows — its own theme's first (shared/utils/roomTheme.ts). Keep every fact
// verifiable.
import { ROOM_THEMES, type RoomTheme } from "@/shared/utils/roomTheme";

const GROUPS = {
  whatsapp: {
    id: "whatsapp",
    emoji: "💬",
    color: "var(--brand-800)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"],
  },
  fired: {
    id: "fired",
    emoji: "📦",
    color: "var(--accent-kraft)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6"],
  },
  quit: {
    id: "quit",
    emoji: "🫡",
    color: "var(--sender-blue)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"],
  },
  drama: {
    id: "drama",
    emoji: "💅",
    color: "var(--sender-pink)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6"],
  },
  groups: {
    id: "groups",
    emoji: "👥",
    color: "var(--accent-exit)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"],
  },
} as const;

export type StoryGroup = (typeof GROUPS)[keyof typeof GROUPS];
export type StoryGroupId = StoryGroup["id"];

/** The groups a room shows, in order: the theme's own story first, then WhatsApp and group life. */
export const THEME_STORY_GROUPS: Record<RoomTheme, readonly StoryGroup[]> = {
  [ROOM_THEMES.classic]: [GROUPS.whatsapp, GROUPS.fired, GROUPS.groups],
  [ROOM_THEMES.fired]: [GROUPS.fired, GROUPS.whatsapp, GROUPS.groups],
  [ROOM_THEMES.quit]: [GROUPS.quit, GROUPS.whatsapp, GROUPS.groups],
  [ROOM_THEMES.fedUp]: [GROUPS.drama, GROUPS.whatsapp, GROUPS.groups],
};

/** Where the viewer is: a group, and a fact in it. */
export interface StoryPosition {
  group: number;
  fact: number;
}

/** How long a fact stays before the next. */
export const STORY_MS = 6500;
/** A press held this long pauses, and is not a tap. */
export const LONG_PRESS_MS = 350;
