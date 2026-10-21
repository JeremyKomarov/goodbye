import { FEATURES, type FeatureKey } from "@/core/config/features.const";

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
