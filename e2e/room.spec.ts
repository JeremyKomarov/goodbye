// A visitor's way through a real room: in under a name, a vote, and back after a reload. The room
// is read on the server, which a browser stub can't reach, so this one writes: a throwaway room
// through the app's own create handler, deleted afterwards with everyone who joined it. Like the
// `*.db.test.ts` files, it skips without the secret key (`.env.local`, loaded by the config).
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const DAY_MS = 86_400_000;

test.skip(
  !SECRET_KEY || !SUPABASE_URL,
  "needs the Supabase secret key, as `npm run test:db` does",
);

const db = () =>
  createClient(SUPABASE_URL!, SECRET_KEY!, { auth: { persistSession: false } });

/** The room and everyone who joined it: the anonymous users go too, and their login codes with them. */
async function deleteRoom(slug: string) {
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

async function countVotes(slug: string) {
  const { data: room } = await db()
    .from("rooms")
    .select("id")
    .eq("slug", slug)
    .single<{ id: string }>();
  const { count } = await db()
    .from("votes")
    .select("*", { count: "exact", head: true })
    .eq("room_id", room!.id);
  return count;
}

test("joins under a name, votes, and is still in after a reload", async ({
  page,
  request,
}) => {
  const created = await request.post("/api/rooms", {
    data: {
      hostName: "e2e",
      hostGender: "f",
      groupName: "e2e — delete me",
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
  const { slug } = (await created.json()) as { slug: string };

  try {
    await page.goto(`/r/${slug}`);
    await page.getByRole("textbox", { name: /what's your name/i }).fill("Dana");
    await page.getByRole("button", { name: /enter/i }).click();

    const chip = page
      .locator("[class*=hour-grid] button[aria-pressed]")
      .first();
    await expect(chip).toBeEnabled({ timeout: 15_000 });
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => countVotes(slug), { timeout: 10_000 }).toBe(1);

    await page.reload();
    await expect(
      page.getByRole("textbox", { name: /what's your name/i }),
    ).toHaveCount(0);
    await expect(
      page.locator("[class*=hour-grid] button[aria-pressed=true]"),
    ).toHaveCount(1);
  } finally {
    await deleteRoom(slug);
  }
});
