import type { Metadata, Viewport } from "next";
import { Karantina, Rubik } from "next/font/google";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const karantina = Karantina({
  variable: "--font-karantina",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
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
    <html lang="he" dir="rtl" className={`${karantina.variable} ${rubik.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
