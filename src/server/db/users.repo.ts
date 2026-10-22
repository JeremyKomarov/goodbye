import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { db } from "./client";

// Supabase Auth's users. Visitors are anonymous users made by the browser; this side checks
// who a token belongs to, and sets the login code behind a player.

/** The user id an access token belongs to, or null for a token Supabase does not accept. */
export async function userIdForAccessToken(accessToken: string): Promise<string | null> {
  const { data, error } = await db().auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user.id;
}

/**
 * Puts an email and password login behind the user, so they can sign in as themselves elsewhere.
 * Setting the password signs out every session the user has.
 */
export async function setLoginPassword(userId: string, email: string, password: string) {
  const { error } = await db().auth.admin.updateUserById(userId, {
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new ApiError(API_ERROR_CODES.upstream_failed, 502);
}
