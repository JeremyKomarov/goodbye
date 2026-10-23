// A visitor's way through a real room: in under a name, a vote, and back after a reload; and, in a
// room the host has left, the goodbyes played back. The room is read on the server, which a
// browser stub can't reach, so this one writes: throwaway rooms — through the app's own create
// handler, or straight into the tables for one that has already ended — deleted afterwards with
// everyone who joined them. Like the
// `*.db.test.ts` files, it skips without the secret key (`.env.local`, loaded by the config), and
// in CI, which has none (`E2E_NO_DATABASE`). The making and deleting are `rooms.ts`'s.
import { expect, test } from "@playwright/test";
import { createRoom, DAY_MS, db, deleteRoom, joinRoom, skipWithoutDatabase, TEST_GROUP } from "./rooms";

skipWithoutDatabase();

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
  const slug = await createRoom(request);

  try {
    await joinRoom(page, slug);

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
      group_name: TEST_GROUP,
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

    await joinRoom(page, slug);
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
