"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Single browser client; the anonymous session persists in localStorage. */
export function getBrowserClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: "exit-party-auth" },
        realtime: { params: { eventsPerSecond: 20 } },
      },
    );
  }
  return client;
}
