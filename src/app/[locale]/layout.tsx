import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { env } from "@/core/config/env";
import { API_ENDPOINTS, PREVIEW_SIZE } from "@/core/constants/api-endpoints.const";
import { localeDirection, routing } from "@/core/i18n/routing";
import { SITE_NAMESPACE, siteKeys } from "@/shared/strings/site.keys.const";
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

// The site's name, description and preview image in the reader's language; a room's page puts its
// own title in front of the name, and its own image.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations(SITE_NAMESPACE);
  const name = t(siteKeys.name);
  const description = t(siteKeys.description);
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: name, template: `%s | ${name}` },
    description,
    openGraph: {
      title: name,
      description,
      siteName: name,
      images: [{ url: API_ENDPOINTS.preview(locale), ...PREVIEW_SIZE, alt: name }],
    },
    twitter: { card: "summary_large_image" },
  };
}

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
