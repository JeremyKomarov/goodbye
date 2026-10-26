import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/core/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";
// Data goes through our Route Handlers, but the browser keeps Supabase's auth and Realtime
// (docs/DECISIONS.md #2): https for the one, wss for the other. Read here, not through
// core/config/env.ts, which throws on any missing value: `next typegen` and `lint` load this file
// with no environment (CI's verify job). The app's own boot still fails loudly without it.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = supabaseUrl ? new URL(supabaseUrl).origin : "";
const realtime = supabase.replace(/^https:/, "wss:");

// No nonces: Cache Components prerender a static shell, which can't carry one, so inline scripts
// are allowed and everything else is held to this origin (docs/DECISIONS.md #16).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${supabase && ` ${supabase} ${realtime}`}`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
