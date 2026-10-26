import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/core/config/env";
import { loginEmail } from "@/core/constants/login.const";
import { db } from "./client";

// Sessions for the `*.db.test.ts` files. An anonymous sign-in is the scarce kind — Supabase allows
// an address 30 an hour, and a run makes a dozen — so a test user is made with the secret key and
// signed in with a one-time link it never sees. A test deletes its users afterwards; one a killed
// run left is swept with the anonymous ones (`…@players.invalid`,
// supabase/migrations/…_host_devices_and_login_codes.sql).

export interface TestSession {
  userId: string;
  token: string;
}

const browser = () =>
  createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: { persistSession: false },
  });

/** A new user and a session for them, as a player's browser would hold it. */
export async function testSession(): Promise<TestSession> {
  const made = await db().auth.admin.createUser({
    email: loginEmail(crypto.randomUUID()),
    email_confirm: true,
  });
  if (made.error) throw made.error;
  const userId = made.data.user.id;
  // A login code signs in with the address made from the user's own id (core/constants/login.const.ts).
  const email = loginEmail(userId);
  const renamed = await db().auth.admin.updateUserById(userId, {
    email,
    email_confirm: true,
  });
  if (renamed.error) throw renamed.error;
  return sessionFor(userId);
}

/** A session for a user `testSession` made, through a one-time sign-in link. */
async function sessionFor(userId: string): Promise<TestSession> {
  const email = loginEmail(userId);
  const link = await db().auth.admin.generateLink({ type: "magiclink", email });
  if (link.error) throw link.error;
  const { data, error } = await browser().auth.verifyOtp({
    token_hash: link.data.properties.hashed_token,
    type: "magiclink",
  });
  if (error || !data.session)
    throw error ?? new Error("no session from the sign-in link");
  return { userId, token: data.session.access_token };
}
