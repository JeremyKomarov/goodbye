// The feature registry — every screen, its route, and whether it is on (04-FEATURES.md §1).
// Nothing else decides whether a feature is on. Flip a flag with the `enable-feature` playbook.
export const FEATURE_KEYS = {
  landing: "landing",
  room: "room",
  games: "games",
  admin: "admin",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];

export const FEATURES: Record<FeatureKey, { route: string; enabled: boolean }> = {
  landing: { route: "/", enabled: false },
  room: { route: "/r/[slug]", enabled: false },
  games: { route: "/r/[slug]/games", enabled: false },
  admin: { route: "/r/[slug]/admin", enabled: false },
};

export function isFeatureEnabled(key: FeatureKey): boolean {
  return FEATURES[key].enabled;
}
