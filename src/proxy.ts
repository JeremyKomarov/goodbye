import { type NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, resolveLocale } from "@/core/i18n/routing";

// Rewrites every page request to its hidden [locale] segment, from the locale cookie alone —
// never Accept-Language, so the default stays Hebrew (docs/DECISIONS.md #3, #6). Not a security
// boundary (01-STRUCTURE.md §8).
export default function proxy(request: NextRequest) {
  const locale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
