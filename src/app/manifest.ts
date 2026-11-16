import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import { createTranslator } from "next-intl";
import { messages } from "@/core/i18n/messages";
import { LOCALE_COOKIE, localeDirection, resolveLocale } from "@/core/i18n/routing";
import { TOKEN_VALUES } from "@/core/styles/token-values.const";
import { SITE_NAMESPACE, siteKeys } from "@/shared/strings/site.keys.const";

// What "Add to Home Screen" installs: the site's name in the reader's language (the cookie; the
// proxy's room language doesn't reach a file outside `[locale]`), and the icons
// `assets/render-icons.mjs` draws. The colour is the page's, as the layout's `themeColor`.
const PAGE = TOKEN_VALUES["neutral-950"];

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = resolveLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  const t = createTranslator({ locale, messages: messages[locale], namespace: SITE_NAMESPACE });
  return {
    name: t(siteKeys.name),
    short_name: t(siteKeys.shortName),
    description: t(siteKeys.description),
    lang: locale,
    dir: localeDirection(locale),
    start_url: "/",
    display: "standalone",
    background_color: PAGE,
    theme_color: PAGE,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
