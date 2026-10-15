"use client";

import styles from "./LanguageSwitch.module.scss";
import { useLocale, useTranslations } from "@/core/i18n/useLocale";

export function LanguageSwitch() {
  const locale = useLocale((state) => state.locale);
  const setLocale = useLocale((state) => state.setLocale);
  const t = useTranslations();
  return <div className={styles.switch} role="group" aria-label={t("language")}>
    <button type="button" className={locale === "he" ? styles.active : styles.option} onClick={() => setLocale("he")}>עברית</button>
    <button type="button" className={locale === "en" ? styles.active : styles.option} onClick={() => setLocale("en")}>English</button>
  </div>;
}
