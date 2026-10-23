import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { db } from "./client";

// Each player's login code, kept so the host can send it to a player who lost it:
// `public.login_codes`, which no client role can read (supabase/migrations/…_login_codes.sql).

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

export async function findLoginCode(userId: string): Promise<string | null> {
  const { data, error } = await db()
    .from("login_codes")
    .select("code")
    .eq("user_id", userId)
    .maybeSingle<{ code: string }>();
  if (error) throw failed();
  return data?.code ?? null;
}

export async function saveLoginCode(userId: string, code: string): Promise<void> {
  const { error } = await db()
    .from("login_codes")
    .upsert({ user_id: userId, code, updated_at: new Date().toISOString() });
  if (error) throw failed();
}

/** The codes of these users, by user id; a user who has none is left out. */
export async function findLoginCodes(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) return new Map();
  const { data, error } = await db()
    .from("login_codes")
    .select("user_id, code")
    .in("user_id", userIds)
    .overrideTypes<{ user_id: string; code: string }[], { merge: false }>();
  if (error) throw failed();
  return new Map(data.map((row) => [row.user_id, row.code]));
}
