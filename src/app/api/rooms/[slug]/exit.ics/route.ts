import type { NextRequest } from "next/server";
import { createTranslator } from "next-intl";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { roomPath } from "@/core/constants/routes.const";
import { messages } from "@/core/i18n/messages";
import { LOCALE_COOKIE, resolveLocale } from "@/core/i18n/routing";
import { handlingApiErrors } from "@/server/api/error-response.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { CALENDAR_NAMESPACE, calendarKeys } from "@/shared/strings/calendar.keys.const";
import { exitEvent, icsFile } from "@/shared/utils/calendar";

const ROUTE = "/api/rooms/[slug]/exit.ics";
type Context = RouteContext<"/api/rooms/[slug]/exit.ics">;

// The locked hour as a calendar file — Apple Calendar, Outlook, most phones. A link the browser
// follows, not a call: the answer is the file or a line of text, never the API's error shape. In
// the room's language (docs/DECISIONS.md #13); an unknown room's line in the visitor's.
export const GET = handlingApiErrors(ROUTE, async (request: NextRequest, { params }: Context) => {
  const { slug } = await params;
  const room = await findRoomBySlug(slug);
  const locale = room?.locale ?? resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const t = createTranslator({ locale, messages: messages[locale], namespace: CALENDAR_NAMESPACE });
  const url = `${request.nextUrl.origin}${roomPath(FEATURE_KEYS.room, slug)}`;
  const event =
    room &&
    exitEvent(
      { id: room.id, lockedSlot: room.lockedSlot === null ? null : Date.parse(room.lockedSlot) },
      {
        title: t(calendarKeys.title, {
          name: room.hostName,
          gender: room.hostGender,
          group: room.groupName,
        }),
        details: t(calendarKeys.details, { url }),
      },
      url,
    );
  if (!event)
    return new Response(t(calendarKeys.notYet), {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });

  return new Response(icsFile(event), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `inline; filename="exit-${slug}.ics"`,
      "cache-control": "no-store",
    },
  });
});
