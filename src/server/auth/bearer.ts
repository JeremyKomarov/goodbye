import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { userIdForAccessToken } from "@/server/db/users.repo";

// The browser's anonymous session, checked on every handler that acts as someone. It runs before
// the body is read (03-DATA.md §1); the token then goes on to `asUser` so the database checks too.

export interface Caller {
  userId: string;
  accessToken: string;
}

const BEARER = /^Bearer\s+(\S+)$/i;

/** The bearer token in the request, or null when there is none. */
export function bearerToken(request: Request): string | null {
  return BEARER.exec(request.headers.get("authorization") ?? "")?.[1] ?? null;
}

/** Who is calling. Throws `unauthorized` for a missing token or one Supabase rejects. */
export async function requireCaller(request: Request): Promise<Caller> {
  const accessToken = bearerToken(request);
  const userId = accessToken ? await userIdForAccessToken(accessToken) : null;
  if (!accessToken || !userId) throw new ApiError(API_ERROR_CODES.unauthorized, 401);
  return { userId, accessToken };
}
