import type { NextRequest } from "next/server";
import { createTranslator } from "next-intl";
import { messages } from "@/core/i18n/messages";
import { resolveLocale } from "@/core/i18n/routing";
import { roomPreview } from "@/features/room/utils/roomPreview";
import { toRoomDto } from "@/server/api/room-snapshot.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { renderCard } from "@/server/og/card.server";
import { mapRoomDto } from "@/shared/api/room.mapper";
import { SITE_NAMESPACE, siteKeys } from "@/shared/strings/site.keys.const";

type Context = RouteContext<"/api/rooms/[slug]/og">;

// A room's link preview tells the story so far — the question, the decision, the verdict — in the
// room's language (docs/DECISIONS.md #13). An unknown room still gets a card, saying so, in the
// language the page asked for (`?locale=`).
export async function GET(request: NextRequest, { params }: Context) {
  const record = await findRoomBySlug((await params).slug);
  const locale =
    record?.locale ?? resolveLocale(request.nextUrl.searchParams.get("locale") ?? undefined);
  const { card } = roomPreview(record && mapRoomDto(toRoomDto(record)), locale);
  const t = createTranslator({ locale, messages: messages[locale], namespace: SITE_NAMESPACE });
  return renderCard(locale, { ...card, badge: t(siteKeys.card.badge) });
}
