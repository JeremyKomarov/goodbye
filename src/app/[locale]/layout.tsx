import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { localeDirection, routing } from "@/core/i18n/routing";
import "@/core/styles/tokens.scss";
import { Providers } from "./providers";

const karantina = localFont({
  src: [{ path: "../../../assets/Karantina-Bold.ttf", weight: "700" }],
  variable: "--font-karantina",
});

const rubik = localFont({
  src: [
    {
      path: "../../../node_modules/@fontsource-variable/rubik/files/rubik-hebrew-wght-normal.woff2",
      weight: "300 900",
    },
    {
      path: "../../../node_modules/@fontsource-variable/rubik/files/rubik-latin-wght-normal.woff2",
      weight: "300 900",
    },
  ],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Goodbye",
  description: "A party room for leaving a WhatsApp group",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b141a",
  viewportFit: "cover",
  // Android: shrink the layout when the keyboard opens so the composer stays visible.
  interactiveWidget: "resizes-content",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      dir={localeDirection(locale)}
      className={`${karantina.variable} ${rubik.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
