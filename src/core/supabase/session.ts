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

// A new login code signs out every session of the user (server/db/users.repo.ts) until this
// browser signs back in with it. A request made in between waits here instead of going out with a
// token the server has just revoked — a score sent right after joining, say.
let resigning: Promise<void> | null = null;

/**
 * Runs `work`, which may replace the user's login code and sign back in, holding every other
 * request's headers until it is done. `work`'s own first request reads its headers before the hold
 * begins, so it never waits on itself.
 */
export function holdingSession<T>(work: () => Promise<T>): Promise<T> {
  const running = work();
  const held = running.then(
    () => undefined,
    () => undefined,
  );
  resigning = held;
  void held.then(() => {
    if (resigning === held) resigning = null;
  });
  return running;
}

/** The `authorization` header for a handler that acts as this browser's user. */
export async function sessionHeaders(): Promise<Record<string, string>> {
  if (resigning) await resigning;
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
