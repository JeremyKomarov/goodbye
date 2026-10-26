import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { env } from "./src/core/config/env";

const withNextIntl = createNextIntlPlugin("./src/core/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";
// Data goes through our Route Handlers, but the browser keeps Supabase's auth and Realtime
// (docs/DECISIONS.md #2): https for the one, wss for the other.
const supabase = new URL(env.supabaseUrl).origin;
const realtime = supabase.replace(/^https:/, "wss:");
// The sign-in captcha's script and frame, when its site key is set (core/supabase/captcha.ts).
const turnstile = "https://challenges.cloudflare.com";

// No nonces: Cache Components prerender a static shell, which can't carry one, so inline scripts
// are allowed and everything else is held to this origin (docs/DECISIONS.md #16).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${turnstile}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${supabase} ${realtime}`,
  `frame-src ${turnstile}`,
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
