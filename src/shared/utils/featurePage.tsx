import type { ComponentType } from "react";
import { type FeatureKey, isFeatureEnabled } from "@/core/config/features.const";
import { ComingSoon } from "@/shared/components/ComingSoon";

/**
 * Builds a route's page from the registry — the only place a flag is read (04-FEATURES.md §2).
 * With no screen, or with the flag off, the page is the disabled shell: never a 404, never a
 * half-working screen.
 */
export function featurePage<Props extends object>(key: FeatureKey, Screen?: ComponentType<Props>) {
  function FeaturePage(props: Props) {
    if (!Screen || !isFeatureEnabled(key)) return <ComingSoon feature={key} />;
    return <Screen {...props} />;
  }
  FeaturePage.displayName = `featurePage(${key})`;
  return FeaturePage;
}
