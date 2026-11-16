import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CreateRoomInputSchema, MAX_GROUP_NAME, type CreateRoomInput,
} from "@/features/landing/api/rooms.dto";
import { forgetDraft, loadDraft, saveDraft } from "./wizardDraft";

const NOW = Date.parse("2026-11-16T10:00:00");
const fresh: CreateRoomInput = {
  hostName: "",
  hostGender: "m",
  groupName: "",
  reason: null,
  timezone: "Asia/Jerusalem",
  windowStart: "2026-11-16",
  days: 2,
  dayStartHour: 9,
  dayEndHour: 22,
  votingClosesAt: new Date(NOW + 3 * 3_600_000).toISOString(),
  locale: "he",
};

let store: Map<string, string>;
beforeEach(() => {
  store = new Map();
  vi.stubGlobal("sessionStorage", {
    setItem: (key: string, value: string) => store.set(key, value),
    getItem: (key: string) => store.get(key) ?? null,
    removeItem: (key: string) => store.delete(key),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("the wizard's draft", () => {
  it("gives back what was typed, and the step, over today's timezone and language", () => {
    const typed = { ...fresh, hostName: "דנה", groupName: "צוות 🚀", reason: "quit" as const,
      days: 4, timezone: "Europe/London", locale: "en" as const };
    saveDraft(typed, 2);
    const back = loadDraft(fresh, NOW);
    expect(back?.step).toBe(2);
    expect(back?.values).toMatchObject({ hostName: "דנה", groupName: "צוות 🚀", reason: "quit",
      days: 4, timezone: "Asia/Jerusalem", locale: "he" });
  });

  it("is nothing when nothing was kept, or what was kept is not a draft", () => {
    expect(loadDraft(fresh, NOW)).toBeNull();
    store.set("goodbye-create-draft", "{not json");
    expect(loadDraft(fresh, NOW)).toBeNull();
    store.set("goodbye-create-draft", JSON.stringify({ values: { hostName: 3 }, step: 0 }));
    expect(loadDraft(fresh, NOW)).toBeNull();
  });

  it("starts a window that has begun, or a close that has passed, from today", () => {
    saveDraft({ ...fresh, windowStart: "2026-11-10", votingClosesAt: "2026-11-11T10:00:00.000Z" }, 2);
    const back = loadDraft(fresh, NOW);
    expect(back?.values.windowStart).toBe(fresh.windowStart);
    expect(back?.values.votingClosesAt).toBe(fresh.votingClosesAt);
  });

  it("falls back to the default for a number the schema refuses", () => {
    saveDraft({ ...fresh, days: 40 }, 2);
    expect(loadDraft(fresh, NOW)?.values.days).toBe(fresh.days);
  });

  it("is gone once forgotten, and a refusing storage keeps nothing and throws nothing", () => {
    saveDraft(fresh, 1);
    forgetDraft();
    expect(loadDraft(fresh, NOW)).toBeNull();
    vi.stubGlobal("sessionStorage", {
      setItem: () => { throw new Error("quota"); },
      getItem: () => { throw new Error("blocked"); },
      removeItem: () => { throw new Error("blocked"); },
    });
    expect(() => saveDraft(fresh, 1)).not.toThrow();
    expect(loadDraft(fresh, NOW)).toBeNull();
  });
});

describe("name limits", () => {
  it("count characters as the database does, so emoji are one each", () => {
    const ok = { ...fresh, hostName: "Dana", groupName: "🚀".repeat(MAX_GROUP_NAME) };
    expect(CreateRoomInputSchema.safeParse(ok).success).toBe(true);
    const over = { ...ok, groupName: "🚀".repeat(MAX_GROUP_NAME + 1) };
    expect(CreateRoomInputSchema.safeParse(over).success).toBe(false);
  });
});
