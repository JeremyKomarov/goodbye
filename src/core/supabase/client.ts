import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/core/config/env";
import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";

let client: SupabaseClient | undefined;

/**
 * The browser's one Supabase client, for the anonymous session and Realtime only — every read and
 * write goes through a Route Handler (docs/DECISIONS.md #2). The session persists in localStorage.
 */
export function browserSupabase(): SupabaseClient {
  client ??= createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: STORAGE_KEYS.supabaseAuth },
    realtime: { params: { eventsPerSecond: 20 } },
  });
  return client;
}
