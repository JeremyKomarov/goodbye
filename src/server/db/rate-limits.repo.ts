import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { db } from "./client";

// The write routes' counts: `public.rate_limits`, through `hit_rate_limit()`, which no client
// role can call (supabase/migrations/…_rate_limits.sql, docs/DECISIONS.md #15).

/** Takes one hit on `key` in its window; true while the key is within `max` hits. */
export async function hitRateLimit(key: string, windowSeconds: number, max: number): Promise<boolean> {
  const { data, error } = await db().rpc("hit_rate_limit", {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  });
  if (error || typeof data !== "boolean") throw new ApiError(API_ERROR_CODES.upstream_failed, 502);
  return data;
}
