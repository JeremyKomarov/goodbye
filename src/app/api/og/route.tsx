import type { NextRequest } from "next/server";
import { createTranslator } from "next-intl";
import { messages } from "@/core/i18n/messages";
import { resolveLocale } from "@/core/i18n/routing";
import { renderCard } from "@/server/og/card.server";
import { SITE_NAMESPACE, siteKeys } from "@/shared/strings/site.keys.const";

// The site's link preview: the question itself, in the language the page asked for (`?locale=`).
export async function GET(request: NextRequest) {
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale") ?? undefined);
  const t = createTranslator({ locale, messages: messages[locale], namespace: SITE_NAMESPACE });
  return renderCard(locale, {
    pill: t(siteKeys.card.pill),
    lines: [t(siteKeys.card.first), t(siteKeys.card.second)],
    badge: t(siteKeys.card.badge),
  });
}
