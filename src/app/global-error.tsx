"use client";

// The root layout itself threw, so this replaces it: its own document, the tokens, and the
// dictionary from the language cookie — the room's language is the proxy's, out of reach here.
import { NextIntlClientProvider } from "next-intl";
import { useState } from "react";
import { messages } from "@/core/i18n/messages";
import { LOCALE_COOKIE, localeDirection, resolveLocale } from "@/core/i18n/routing";
import { ErrorScreen, type ErrorScreenProps } from "@/shared/components/ErrorScreen";
import "@/core/styles/tokens.scss";

function cookieLocale() {
  if (typeof document === "undefined") return resolveLocale(undefined);
  const pair = document.cookie.split("; ").find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
  return resolveLocale(pair?.slice(LOCALE_COOKIE.length + 1));
}

export default function GlobalError(props: ErrorScreenProps) {
  const [locale] = useState(cookieLocale);

  return (
    <html lang={locale} dir={localeDirection(locale)}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <ErrorScreen {...props} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
