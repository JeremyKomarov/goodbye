// A visitor's way through a real room: in under a name, a vote, and back after a reload; and, in a
// room the host has left, the goodbyes played back. The room is read on the server, which a
// browser stub can't reach, so this one writes: throwaway rooms — through the app's own create
// handler, or straight into the tables for one that has already ended — deleted afterwards with
// everyone who joined them. Like the
// `*.db.test.ts` files, it skips without the secret key (`.env.local`, loaded by the config), and
// in CI, which has none (`E2E_NO_DATABASE`).
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const DAY_MS = 86_400_000;

test.skip(
  !SECRET_KEY || !SUPABASE_URL || Boolean(process.env.E2E_NO_DATABASE),
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

test("plays the goodbyes back once the host has left", async ({ page }) => {
  const day = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
  const slug = `e2e${Math.random().toString(36).slice(2, 10)}`;
  const { data: room, error } = await db()
    .from("rooms")
    .insert({
      slug,
      host_name: "e2e",
      group_name: "e2e — delete me",
      window_start: day,
      window_end: day,
      day_start_hour: 9,
      day_end_hour: 22,
      voting_closes_at: new Date(Date.now() - 2 * DAY_MS).toISOString(),
      status: "exited",
      locked_slot: `${day}T09:00:00.000Z`,
      exited_at: new Date().toISOString(),
      locale: "en",
    })
    .select("id")
    .single<{ id: string }>();
  expect(error).toBeNull();

  try {
    const goodbyes = [
      ["Noa", "see you never"],
      ["Yossi", "bye, and thanks for all the memes"],
    ];
    for (const [name, body] of goodbyes) {
      const userId = crypto.randomUUID();
      await db().from("players").insert({ room_id: room!.id, user_id: userId, display_name: name });
      const posted = await db()
        .from("wall_messages")
        .insert({ room_id: room!.id, user_id: userId, display_name: name, body });
      expect(posted.error).toBeNull();
    }

    await page.goto(`/r/${slug}`);
    await page.getByRole("textbox", { name: /what's your name/i }).fill("Dana");
    await page.getByRole("button", { name: /enter/i }).click();
    // The finale opens by itself once per exit.
    await page.getByRole("button", { name: "Back to the room" }).click();

    await page.getByRole("button", { name: "Replay the goodbyes" }).first().click();
    const replay = page.getByRole("dialog", { name: "The goodbyes" });
    await expect(replay).toContainText("see you never");
    await expect(replay).toContainText("1 of 2");
    await replay.getByRole("button", { name: "Next goodbye" }).click();
    await expect(replay).toContainText("bye, and thanks for all the memes");
    await expect(replay).toContainText("2 of 2");
    await replay.getByRole("button", { name: "Next goodbye" }).click();
    await expect(replay).toHaveCount(0);
  } finally {
    await deleteRoom(slug);
  }
});
