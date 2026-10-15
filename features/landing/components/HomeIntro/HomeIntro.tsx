"use client";

import styles from "./HomeIntro.module.scss";
import { useTranslations } from "@/core/i18n/useLocale";

export function HomeIntro() {
  const t = useTranslations();
  return <>
    <h1 className={styles.title}>{t("homeTitleFirst")}<br />{t("homeTitleSecond")}</h1>
    <p className={styles.description}>{t("homeDescription")}</p>
  </>;
}
