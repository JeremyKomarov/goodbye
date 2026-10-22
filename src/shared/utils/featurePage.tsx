import type { ComponentType, ReactNode } from "react";
import { type FeatureKey, isFeatureEnabled } from "@/core/config/features.const";
import { ComingSoon } from "@/shared/components/ComingSoon";

/**
 * Builds a route's page from the registry — with `featureLayout`, the only place a flag is read
 * (04-FEATURES.md §2).
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

/**
 * A route's layout, gated the same way: with the flag off its pages render as they are — each
 * one the disabled shell — and the feature's frame around them is never drawn.
 */
export function featureLayout<Props extends { children: ReactNode }>(
  key: FeatureKey,
  Frame: ComponentType<Props>,
) {
  function FeatureLayout(props: Props) {
    if (!isFeatureEnabled(key)) return props.children;
    return <Frame {...props} />;
  }
  FeatureLayout.displayName = `featureLayout(${key})`;
  return FeatureLayout;
}
