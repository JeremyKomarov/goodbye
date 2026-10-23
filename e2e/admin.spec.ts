// The host's page at a phone's and a laptop's size, against a stubbed admin answer: no room is
// written. The room's live channel still connects (to a room id no one has), and its first change
// re-reads the stub — which is how the "live" case moves without a reload.
import { expect, test, type Page } from "@playwright/test";

const SLUG = "e2e00000";
const TOKEN = "a-token-of-at-least-twenty-characters";
const ADMIN = `/r/${SLUG}/admin#k=${TOKEN}`;
const DAY_MS = 86_400_000;

type Status = "voting" | "locked";

function room(status: Status) {
  const day = new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10);
  return {
    id: "00000000-0000-4000-8000-0000000000e2",
    slug: SLUG,
    host_name: "Jeremy",
    host_gender: "m",
    group_name: "Product team",
    reason: "quit",
    timezone: "Asia/Jerusalem",
    window_start: day,
    window_end: day,
    day_start_hour: 9,
    day_end_hour: 22,
    voting_closes_at: new Date(Date.now() + DAY_MS).toISOString(),
    status,
    locked_slot: status === "locked" ? `${day}T09:00:00.000Z` : null,
    exited_at: null,
  };
}

const player = (
  name: string,
  n: number,
  hasVoted: boolean,
  isHost = false,
) => ({
  user_id: `u${n}`,
  display_name: name,
  is_host: isHost,
  code: isHost ? null : `ABC23${n}`,
  has_voted: hasVoted,
});

const message = (id: number, body: string) => ({
  id,
  display_name: "Dana",
  body,
  created_at: new Date().toISOString(),
});

interface Answer {
  status?: Status;
  /** Who but the host has voted, by name. */
  voted?: string[];
  messages?: ReturnType<typeof message>[];
}

/** Answers the admin GET from `answer()`, read afresh on every request; a wrong token is refused. */
async function stubAdmin(page: Page, answer: () => Answer) {
  const requests: string[] = [];
  await page.route(`**/api/rooms/${SLUG}/admin**`, async (route) => {
    const request = route.request();
    requests.push(`${request.method()} ${new URL(request.url()).pathname}`);
    if (request.headers()["x-admin-token"] !== TOKEN)
      return route.fulfill({
        status: 403,
        json: { error: { code: "forbidden" } },
      });
    if (request.method() === "DELETE") return route.fulfill({ status: 204 });
    const { status = "voting", voted = [], messages = [] } = answer();
    const guests = ["Dana", "Yossi", "Noa"].map((name, i) =>
      player(name, i + 1, voted.includes(name)),
    );
    return route.fulfill({
      json: {
        room: room(status),
        players: [player("Jeremy", 0, false, true), ...guests],
        messages,
      },
    });
  });
  return requests;
}

const reminder = (page: Page) => page.locator("[class*=vote-reminder]").first();

async function noSidewaysScroll(page: Page) {
  const sideways = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(sideways, "the page scrolls sideways").toBe(0);
}

test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([
    { name: "NEXT_LOCALE", value: "en", url: baseURL! },
  ]);
});

test("names who hasn't voted, and the reminder names them too", async ({
  page,
}) => {
  await stubAdmin(page, () => ({ voted: ["Dana"] }));
  await page.goto(ADMIN);
  await expect(reminder(page)).toContainText("1 of 3 voted");
  await expect(reminder(page)).toContainText("Yossi");
  await expect(reminder(page)).toContainText("Noa");
  await expect(reminder(page)).not.toContainText("Dana");

  const href = await reminder(page).getByRole("link").getAttribute("href");
  const text = new URL(href!).searchParams.get("text")!;
  expect(text).toContain("Yossi");
  expect(text).toContain("Noa");
  expect(text).toContain(`/r/${SLUG}`);
  await noSidewaysScroll(page);
});

test("follows the room without a reload", async ({ page }) => {
  let voted: string[] = [];
  await stubAdmin(page, () => ({ voted }));
  await page.goto(ADMIN);
  await expect(reminder(page)).toContainText("0 of 3 voted");
  voted = ["Dana", "Yossi", "Noa"];
  // The channel's change on connect re-reads the host's view — the same path a real vote takes.
  await expect(reminder(page)).toContainText("Everyone has voted", {
    timeout: 15_000,
  });
});

test("has no reminder once the vote has closed", async ({ page }) => {
  await stubAdmin(page, () => ({ status: "locked" }));
  await page.goto(ADMIN);
  await expect(page.locator("[class*=admin-controls]").first()).toBeVisible();
  await expect(page.locator("[class*=vote-reminder]")).toHaveCount(0);
});

test("deletes a goodbye after asking", async ({ page }) => {
  let messages = [message(7, "see you never"), message(6, "bye!")];
  const requests = await stubAdmin(page, () => ({ messages }));
  await page.goto(ADMIN);
  const wall = page.locator("[class*=admin-wall]").first();
  await expect(wall).toContainText("see you never");

  page.once("dialog", (dialog) => void dialog.accept());
  messages = messages.filter((m) => m.id !== 7);
  await wall.getByRole("button", { name: "Delete" }).first().click();
  await expect(wall).not.toContainText("see you never");
  await expect(wall).toContainText("bye!");
  expect(requests).toContain(`DELETE /api/rooms/${SLUG}/admin/messages/7`);
});

test("refuses a wrong admin link", async ({ page }) => {
  await stubAdmin(page, () => ({}));
  await page.goto(`/r/${SLUG}/admin#k=a-wrong-token-of-twenty-characters`);
  await expect(page.getByText("This admin link doesn't work")).toBeVisible();
  await expect(page.locator("[class*=admin-controls]")).toHaveCount(0);
});

test("an unknown room's link says so", async ({ page }) => {
  // A real read, and nothing written: no room has this slug.
  await page.goto("/r/e2enoroom");
  await expect(page.getByText("This link doesn't work anymore")).toBeVisible();
  await noSidewaysScroll(page);
});
