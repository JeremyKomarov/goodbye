import { z } from "zod";

// The only file that reads a public environment variable (01-STRUCTURE.md §8). Next inlines
// `process.env.NEXT_PUBLIC_*` only where it is written literally, so each one is named here.
const PublicEnvSchema = z.object({
  supabaseUrl: z.url(),
  supabasePublishableKey: z.string().min(1),
  siteUrl: z.url().transform((url) => url.replace(/\/+$/, "")),
  useMocks: z.enum(["true", "false"]).default("false").transform((flag) => flag === "true"),
});

export type PublicEnv = z.infer<typeof PublicEnvSchema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const env = PublicEnvSchema.parse(source);
  // A mock reports success without doing the work, so it must never reach users (03-DATA.md §3).
  if (env.useMocks && process.env.NODE_ENV === "production")
    throw new Error("NEXT_PUBLIC_USE_MOCKS is on in a production build — turn it off.");
  return env;
}

export const env = parsePublicEnv({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS || undefined,
});
