"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/core/i18n/routing";
import { languageSwitchClasses } from "./LanguageSwitch.classes";
import { LANGUAGE_SWITCH_NAMESPACE, languageSwitchKeys } from "./LanguageSwitch.keys.const";

const ONE_YEAR_S = 60 * 60 * 24 * 365;

/**
 * Hebrew ↔ English. Writes LOCALE_COOKIE and reloads: the language is the root `[locale]` segment
 * the proxy picks from that cookie, so `<html lang dir>` changes too (docs/DECISIONS.md #6).
 */
export function LanguageSwitch() {
  const t = useTranslations(LANGUAGE_SWITCH_NAMESPACE);
  const current = useLocale();

  return (
    <div
      className={languageSwitchClasses.root}
      role="group"
      aria-label={t(languageSwitchKeys.label)}
    >
      {Object.values(LOCALES).map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={locale === current}
          className={languageSwitchClasses.option}
          onClick={() => locale !== current && switchTo(locale)}
        >
          {t(languageSwitchKeys[locale])}
        </button>
      ))}
    </div>
  );
}

function switchTo(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_S}; samesite=lax`;
  window.location.reload();
}
