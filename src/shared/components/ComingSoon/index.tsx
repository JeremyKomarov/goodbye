import { useTranslations } from "next-intl";
import { FEATURES_NAMESPACE, featuresKeys } from "@/core/config/features.keys.const";
import type { FeatureKey } from "@/core/config/features.const";
import { comingSoonClasses } from "./ComingSoon.classes";
import { COMING_SOON_NAMESPACE, comingSoonKeys } from "./ComingSoon.keys.const";

/** The disabled shell: what a feature's route renders while its flag is off (04-FEATURES.md §2). */
export function ComingSoon({ feature }: { feature: FeatureKey }) {
  const t = useTranslations(COMING_SOON_NAMESPACE);
  const tFeature = useTranslations(FEATURES_NAMESPACE);

  return (
    <main className={comingSoonClasses.root}>
      <span className={comingSoonClasses.pill}>{t(comingSoonKeys.marker)}</span>
      <h1 className={comingSoonClasses.title}>{tFeature(featuresKeys[feature].label)}</h1>
      <p className={comingSoonClasses.body}>{tFeature(featuresKeys[feature].blurb)}</p>
      <p className={comingSoonClasses.note}>{t(comingSoonKeys.note)}</p>
    </main>
  );
}
