// Every TanStack query key, once (03-DATA.md §1). A room's keys share the prefix `room.all(slug)`,
// which is what its Realtime channel invalidates (docs/DECISIONS.md #2).
export const QUERY_KEYS = {
  // This browser's user id — per browser, not per room; changes on join, code sign-in, "not you?".
  session: {
    user: ["session", "user"] as const,
  },
  room: {
    all: (slug: string) => ["room", slug] as const,
    snapshot: (slug: string) => ["room", slug, "snapshot"] as const,
  },
} as const;
