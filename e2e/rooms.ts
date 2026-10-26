// The throwaway rooms the specs that write play in: made through the app's own create handler (or
// straight into the tables), joined as a visitor, and deleted after with everyone who joined.
// Every one is "e2e — delete me", so `sweep.ts` catches any a killed run leaves behind.
import { createClient } from "@supabase/supabase-js";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { LOGIN_CODE_ALPHABET, LOGIN_CODE_LENGTH, loginEmail } from "@/core/constants/login.const";
import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const DAY_MS = 86_400_000;
export const TEST_GROUP = "e2e — delete me";

/** Skips the spec without the secret key (`.env.local`), and in CI, which has none. */
export function skipWithoutDatabase() {
  test.skip(
    !SECRET_KEY || !SUPABASE_URL || Boolean(process.env.E2E_NO_DATABASE),
    "needs the Supabase secret key, as `npm run test:db` does",
  );
}

export const db = () =>
  createClient(SUPABASE_URL!, SECRET_KEY!, { auth: { persistSession: false } });

/** A room open for voting, made as a host would, in English; its slug. */
export async function createRoom(request: APIRequestContext) {
  // Its own made-up IP: the dev server keeps a sent `x-forwarded-for` (Vercel replaces it), so
  // runs within the hour don't spend one room budget (docs/DECISIONS.md #15).
  const created = await request.post("/api/rooms", {
    headers: { "x-forwarded-for": `e2e-${crypto.randomUUID()}` },
    data: {
      hostName: "e2e",
      hostGender: "f",
      groupName: TEST_GROUP,
      reason: "quit",
      timezone: "Asia/Jerusalem",
      windowStart: new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10),
      days: 1,
      dayStartHour: 9,
      dayEndHour: 22,
      votingClosesAt: new Date(Date.now() + DAY_MS).toISOString(),
      locale: "en",
    },
  });
  expect(created.status()).toBe(201);
  return ((await created.json()) as { slug: string }).slug;
}

/** In through the join gate, under `name`, and waits until the room has saved it. */
export async function joinRoom(page: Page, slug: string, name = "Dana") {
  await page.goto(`/r/${slug}`);
  await page.getByRole("textbox", { name: /what's your name/i }).fill(name);
  const joined = page.waitForResponse(
    (r) => r.url().endsWith(`/rooms/${slug}/me`) && r.request().method() === "PUT",
  );
  await page.getByRole("button", { name: /enter/i }).click();
  expect((await joined).ok()).toBe(true);
}

/**
 * A player already in the room, signed in on `page` before it loads — for a spec about what comes
 * after joining. The join gate itself is `room.spec.ts`'s: an anonymous sign-in is the scarce kind
 * (Supabase allows an address 30 an hour), so this one signs in with a login code instead. The code
 * is stored up front: the room makes one for a player who has none, and making one signs out every
 * session — this one too.
 */
export async function seatPlayer(page: Page, slug: string, name = "Dana") {
  const { data: room } = await db().from("rooms").select("id").eq("slug", slug).single<{ id: string }>();
  const code = Array.from(
    crypto.getRandomValues(new Uint32Array(LOGIN_CODE_LENGTH)),
    (n) => LOGIN_CODE_ALPHABET[n % LOGIN_CODE_ALPHABET.length],
  ).join("");
  const { data: made, error } = await db().auth.admin.createUser({
    email: loginEmail(crypto.randomUUID()),
    password: code,
    email_confirm: true,
  });
  expect(error).toBeNull();
  const userId = made.user!.id;
  // The address a login code signs in with is the user's own id.
  await db().auth.admin.updateUserById(userId, { email: loginEmail(userId) });
  const seated = await db()
    .from("players")
    .insert({ room_id: room!.id, user_id: userId, display_name: name });
  expect(seated.error).toBeNull();
  const coded = await db().from("login_codes").insert({ user_id: userId, code });
  expect(coded.error).toBeNull();

  const visitor = createClient(SUPABASE_URL!, PUBLISHABLE_KEY!, { auth: { persistSession: false } });
  const { data: signedIn } = await visitor.auth.signInWithPassword({
    email: loginEmail(userId),
    password: code,
  });
  expect(signedIn.session).not.toBeNull();
  // On the first page only: after it, the session is the app's to keep and refresh.
  await page.addInitScript(
    ([key, session]) => localStorage.getItem(key) ?? localStorage.setItem(key, session),
    [STORAGE_KEYS.supabaseAuth, JSON.stringify(signedIn.session)] as const,
  );
  return { userId, code };
}

/** The room and everyone who joined it: the anonymous users go too, and their login codes with them. */
export async function deleteRoom(slug: string) {
  const { data: room } = await db()
    .from("rooms")
    .select("id")
    .eq("slug", slug)
    .single<{ id: string }>();
  if (!room) return;
  const { data: players } = await db()
    .from("players")
    .select("user_id")
    .eq("room_id", room.id);
  await db().from("rooms").delete().eq("id", room.id);
  for (const { user_id } of players ?? [])
    await db().auth.admin.deleteUser(user_id);
}
