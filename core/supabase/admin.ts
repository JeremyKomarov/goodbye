import "server-only";

import { createClient } from "@supabase/supabase-js";

/** Secret-key client. Bypasses RLS, so only use it in server actions after checks. */
export function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
