import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/core/config/env";
import { serverEnv } from "@/core/config/env.server";

let client: SupabaseClient | undefined;

/**
 * The secret-key client. It bypasses row-level security, so it never leaves server/db/: a repo
 * function does the one thing its caller already checked it may do (01-STRUCTURE.md §8).
 */
export function db(): SupabaseClient {
  client ??= createClient(env.supabaseUrl, serverEnv.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/**
 * A client that acts as the caller: the publishable key plus their access token, so row-level
 * security and `auth.uid()` judge the write as the database's second line (docs/DECISIONS.md #2).
 * Made per request — it holds one person's token.
 */
export function asUser(accessToken: string): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { authorization: `Bearer ${accessToken}` } },
  });
}
