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
