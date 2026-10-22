import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { loginEmail, normalizeLoginCode } from "@/core/constants/login.const";
import { captchaToken } from "./captcha";
import { browserSupabase } from "./client";

// Who this browser is: an anonymous Supabase user, made on first join and kept in localStorage.
// Fetchers send its access token as a bearer token; handlers verify it (docs/DECISIONS.md #2).

/** This browser's user id, or null before it has ever joined a room. */
export async function currentUserId(): Promise<string | null> {
  const { data } = await browserSupabase().auth.getSession();
  return data.session?.user.id ?? null;
}

/** This browser's user id, signing in anonymously first if there is no session yet. */
export async function ensureSession(language: string): Promise<string> {
  const auth = browserSupabase().auth;
  const { data } = await auth.getSession();
  if (data.session) return data.session.user.id;
  const { data: signedIn, error } = await auth.signInAnonymously({
    options: { captchaToken: await captchaToken(language) },
  });
  if (error || !signedIn.user) throw new ApiError(API_ERROR_CODES.unauthorized, 401);
  return signedIn.user.id;
}

/** The `authorization` header for a handler that acts as this browser's user. */
export async function sessionHeaders(): Promise<Record<string, string>> {
  const { data } = await browserSupabase().auth.getSession();
  if (!data.session) throw new ApiError(API_ERROR_CODES.unauthorized, 401);
  return { authorization: `Bearer ${data.session.access_token}` };
}

/** Forgets this browser's user here, in every room — "not you?". Other devices stay signed in. */
export async function signOutHere(): Promise<void> {
  await browserSupabase().auth.signOut({ scope: "local" });
}

const TOO_MANY_REQUESTS = 429;

/**
 * Signs this browser in as `userId` with their login code — the other device's player, or this
 * one again after a new code signed every session out. Throws `wrong_login_code` or
 * `too_many_attempts`.
 */
export async function signInWithCode(userId: string, code: string): Promise<void> {
  const { error } = await browserSupabase().auth.signInWithPassword({
    email: loginEmail(userId),
    password: normalizeLoginCode(code),
  });
  if (!error) return;
  throw error.status === TOO_MANY_REQUESTS
    ? new ApiError(API_ERROR_CODES.too_many_attempts, TOO_MANY_REQUESTS)
    : new ApiError(API_ERROR_CODES.wrong_login_code, 401);
}
