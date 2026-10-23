import { type NextRequest, NextResponse } from "next/server";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ROUTES } from "@/core/constants/routes.const";
import { LOCALE_COOKIE, resolveLocale, type Locale } from "@/core/i18n/routing";
import { findRoomLocale } from "@/server/db/rooms.repo";

// `/r/[slug]` and everything under it — the sections, the games, the admin page.
const ROOM_PATH = new RegExp(
  `^${ROUTES[FEATURE_KEYS.room].replace("[slug]", "([^/]+)")}(?:/|$)`,
);

// A room's language is set once, when it is created, so a lookup holds for the life of the server.
const roomLocales = new Map<string, Locale>();

async function roomLocale(slug: string): Promise<Locale | null> {
  const known = roomLocales.get(slug);
  if (known) return known;
  // Unreadable is not fatal: the page still renders, in the visitor's language, and says so if
  // the room is gone.
  const locale = await findRoomLocale(slug).catch(() => null);
  if (locale) roomLocales.set(slug, locale);
  return locale;
}

// Rewrites every page request to its hidden [locale] segment (docs/DECISIONS.md #6). A room's
// pages are in the room's language, the one its host created it in, for everyone
// (docs/DECISIONS.md #13); every other page is in the visitor's, from the locale cookie alone —
// never Accept-Language, so the default stays Hebrew (#3). Not a security boundary
// (01-STRUCTURE.md §8).
export default async function proxy(request: NextRequest) {
  const slug = ROOM_PATH.exec(request.nextUrl.pathname)?.[1];
  const locale =
    (slug && (await roomLocale(decodeURIComponent(slug)))) ||
    resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
