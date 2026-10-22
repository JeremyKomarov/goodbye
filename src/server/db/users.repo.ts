import "server-only";
import { db } from "./client";

// Supabase Auth's users. Visitors are anonymous users made by the browser; this side only checks
// who a token belongs to (and, from 05.9, sets the login code behind a player).

/** The user id an access token belongs to, or null for a token Supabase does not accept. */
export async function userIdForAccessToken(accessToken: string): Promise<string | null> {
  const { data, error } = await db().auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user.id;
}
