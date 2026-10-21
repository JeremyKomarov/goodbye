import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "@/core/styles/tokens.scss";

const karantina = localFont({
  src: [{ path: "../../assets/Karantina-Bold.ttf", weight: "700" }],
  variable: "--font-karantina",
});

const rubik = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/rubik/files/rubik-hebrew-wght-normal.woff2",
      weight: "300 900",
    },
    {
      path: "../../node_modules/@fontsource-variable/rubik/files/rubik-latin-wght-normal.woff2",
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${karantina.variable} ${rubik.variable}`}>
      <body>{children}</body>
    </html>
  );
}
