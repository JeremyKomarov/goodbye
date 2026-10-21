import { defineRouting } from "next-intl/routing";

export const LOCALES = { he: "he", en: "en" } as const;

/** The cookie the language switch writes and the proxy reads. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

// Hebrew unless the visitor switched (docs/DECISIONS.md #3) — never guessed from the browser. The
// locale is a hidden `[locale]` segment: `src/proxy.ts` rewrites to it from LOCALE_COOKIE, so URLs
// never carry a prefix and a shared room link is the same link in both languages
// (docs/DECISIONS.md #6).
export const routing = defineRouting({
  locales: Object.values(LOCALES),
  defaultLocale: LOCALES.he,
  localePrefix: "never",
  localeDetection: false,
  localeCookie: { name: LOCALE_COOKIE },
});

const RTL: ReadonlySet<Locale> = new Set([LOCALES.he]);

export function localeDirection(locale: Locale): "rtl" | "ltr" {
  return RTL.has(locale) ? "rtl" : "ltr";
}

export function isLocale(value: unknown): value is Locale {
  return (routing.locales as readonly unknown[]).includes(value);
}

/** The locale a request asked for: its cookie, if it names one we have, else the default. */
export function resolveLocale(cookie: string | undefined): Locale {
  return isLocale(cookie) ? cookie : routing.defaultLocale;
}
