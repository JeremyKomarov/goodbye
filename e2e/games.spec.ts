// Each game played to its end in a real room, and its score kept: the POST answers 204 and the
// result says so. Played fast, not well — a skip or the first option is enough to finish a round.
// Writes a throwaway room (`rooms.ts`), so it skips without the secret key, and in CI.
import { expect, test, type Page } from "./test";
import { createRoom, deleteRoom, seatPlayer, skipWithoutDatabase } from "./rooms";

skipWithoutDatabase();

const ROUNDS = { trivia: 10, picture: 6 };
// Catch runs for 30 seconds whatever you do.
const CATCH_MS = 30_000;

/** The round's score, sent once the game ends; resolves to the answer's status. */
const scoreSent = (page: Page) =>
  page
    .waitForResponse(
      (r) => r.url().endsWith("/scores") && r.request().method() === "POST",
      { timeout: CATCH_MS + 15_000 },
    )
    .then((r) => r.status());

/** First in a fresh room, so the result is the room's record. */
async function resultShown(page: Page) {
  await expect(page.getByText("New room record 👑")).toBeVisible();
  await expect(page.getByRole("button", { name: "Another round" })).toBeVisible();
}

// One player, seated rather than joined (`seatPlayer`), plays every game on one page, in order:
// each is a first record in its own game.
test.describe.configure({ mode: "serial" });

let slug: string;
let page: Page;

test.beforeAll(async ({ browser, request }, { project }) => {
  slug = await createRoom(request);
  // A page made here gets none of the project's size or address by itself.
  const { viewport, hasTouch, userAgent, deviceScaleFactor, baseURL } = project.use;
  page = await browser.newPage({ viewport, hasTouch, userAgent, deviceScaleFactor, baseURL });
  await seatPlayer(page, slug);
});

test.afterAll(async () => {
  await page?.close();
  await deleteRoom(slug);
});

test("the hub links each game", async () => {
  await page.goto(`/r/${slug}/games`);
  for (const game of ["runaway", "trivia", "catch", "picture"])
    await expect(page.locator(`a[href$="/games/${game}"]`)).toBeVisible();
});

test("Runaway: caught, timed and kept", async () => {
  await page.goto(`/r/${slug}/games/runaway`);
  await page.getByRole("button", { name: "Start" }).click();
  const sent = scoreSent(page);
  // The first press makes it dodge; a second a frame later — rendered, but before it has rested
  // its 45 ms — catches it.
  await page.locator("[class*=runaway-game__exit]").evaluate(async (button) => {
    const press = () =>
      button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" }));
    press();
    await new Promise(requestAnimationFrame);
    press();
  });
  expect(await sent).toBe(204);
  await resultShown(page);
});

test("Trivia: ten questions answered and kept", async () => {
  await page.goto(`/r/${slug}/games/trivia`);
  await page.getByRole("button", { name: "Start" }).click();
  const sent = scoreSent(page);
  for (let i = 1; i <= ROUNDS.trivia; i++) {
    await expect(page.getByText(`Question ${i} of ${ROUNDS.trivia}`)).toBeVisible();
    await page.locator("[class*=trivia-game__option]:enabled").first().click();
    await page
      .getByRole("button", { name: i === ROUNDS.trivia ? "See my score" : "Next question" })
      .click();
  }
  expect(await sent).toBe(204);
  await resultShown(page);
});

test("Picture: six pictures skipped and kept", async () => {
  await page.goto(`/r/${slug}/games/picture`);
  await page.getByRole("button", { name: "Start" }).click();
  const sent = scoreSent(page);
  for (let i = 1; i <= ROUNDS.picture; i++) {
    await expect(page.getByText(`Picture ${i} of ${ROUNDS.picture}`)).toBeVisible();
    await page.getByRole("button", { name: "Skip" }).click();
    await page
      .getByRole("button", { name: i === ROUNDS.picture ? "See my score" : "Next picture" })
      .click();
  }
  expect(await sent).toBe(204);
  // Nothing guessed is 0 points, which is still a first record.
  await resultShown(page);
});

test("Catch: a round run out and kept", async () => {
  test.setTimeout(CATCH_MS + 60_000);
  await page.goto(`/r/${slug}/games/catch`);
  await page.getByRole("button", { name: "Start" }).click();
  expect(await scoreSent(page)).toBe(204);
  await resultShown(page);
});
