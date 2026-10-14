import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Room } from "@/lib/types";

/** Session-less client for public reads on the server. */
export function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (!/^[A-Za-z0-9_-]{6,16}$/.test(slug)) return null;
  const { data } = await getPublicClient().from("rooms").select("*").eq("slug", slug).maybeSingle();
  return (data as Room | null) ?? null;
}
