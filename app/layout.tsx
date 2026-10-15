import styles from "./layout.module.scss";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_NAME, siteUrl } from "@/core/site";
import { AppProviders } from "@/core/providers/AppProviders";
import "./globals.scss";

const karantina = localFont({
  src: [
    { path: "../assets/Karantina-Bold.ttf", weight: "700" },
  ],
  variable: "--font-karantina",
});

const rubik = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/rubik/files/rubik-hebrew-wght-normal.woff2", weight: "300 900" },
    { path: "../node_modules/@fontsource-variable/rubik/files/rubik-latin-wght-normal.woff2", weight: "300 900" },
  ],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "פותחים חדר, שולחים קישור לקבוצה, וכולם מצביעים באיזו שעה תצאו ממנה.",
};

export const viewport: Viewport = {
  themeColor: "#0b141a",
  viewportFit: "cover",
  // Android: shrink the layout when the keyboard opens so the composer stays visible.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={["", karantina.variable, "", rubik.variable, styles.view1].filter(Boolean).join(" ")}>
      <body className={styles.view2}><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
