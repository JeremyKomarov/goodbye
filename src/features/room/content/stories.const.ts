// The status stories: three groups of facts, shown like WhatsApp statuses. The words are the
// `stories` namespace's (StatusStories.strings.ts); here is each group's look and its facts' keys.
// Keep every fact verifiable.

export const STORY_GROUPS = [
  {
    id: "whatsapp",
    emoji: "💬",
    color: "var(--brand-800)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"],
  },
  {
    id: "fired",
    emoji: "📦",
    color: "var(--accent-kraft)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6"],
  },
  {
    id: "groups",
    emoji: "👥",
    color: "var(--accent-exit)",
    facts: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"],
  },
] as const;

export type StoryGroup = (typeof STORY_GROUPS)[number];
export type StoryGroupId = StoryGroup["id"];

/** Where the viewer is: a group, and a fact in it. */
export interface StoryPosition {
  group: number;
  fact: number;
}

/** How long a fact stays before the next. */
export const STORY_MS = 6500;
/** A press held this long pauses, and is not a tap. */
export const LONG_PRESS_MS = 350;
