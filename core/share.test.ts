import { describe, expect, it } from "vitest";
import { makeRoom } from "@/core/test/room";
import {
  adminLinkMessage,
  codeMessage,
  exitStats,
  goodbyeMessage,
  resultMessage,
  whatsappLink,
} from "@/core/share";
import type { LeaderboardRow, WallMessage } from "@/core/types";

const room = makeRoom({
  status: "locked",
  locked_slot: "2026-11-10T16:00:00Z",
});
const url = "https://example.com/r/abc12345";
const strip = (text: string) => text.replace(/[⁦-⁩]/g, "");

const message = (id: number, name: string, body: string): WallMessage => ({
  id,
  room_id: room.id,
  user_id: `u${id}`,
  display_name: name,
  body,
  created_at: "2026-11-09T12:00:00Z",
});

describe("resultMessage", () => {
  it("announces the hour and links the room", () => {
    const text = strip(resultMessage(room, url, 1, true));
    expect(text).toContain("ג׳רמי יוצא מהקבוצה יום ג׳ 10.11 ב-18:00");
    expect(text).toContain("ההגרלה בחרה");
    expect(text).toContain("אדם אחד הצביע");
    expect(text).toContain(url);
  });
});

describe("goodbyeMessage", () => {
  it("sums up the room", () => {
    const leaderboard: LeaderboardRow[] = [
      {
        room_id: room.id,
        game: "trivia",
        user_id: "u1",
        score: 900,
        display_name: "דנה",
      },
    ];
    const stats = exitStats({
      voterCount: 12,
      messages: [message(1, "דנה", "נתגעגע"), message(2, "אבי", "ביי!")],
      reactions: { 2: { u1: "❤️", u3: "😂" }, 1: { u2: "❤️" } },
      leaderboard,
    });
    const text = strip(goodbyeMessage(room, url, stats));
    expect(text).toContain("אני יוצא מהקבוצה בשעה שבחרתם, 18:00");
    expect(text).toContain("12 הצביעו · 💬 2 הודעות פרידה");
    expect(text).toContain('ההודעה הכי אהובה: "ביי!" (אבי)');
    expect(text).toContain("👑 טריוויה של קבוצות: דנה");
  });

  it("leaves out what didn't happen", () => {
    const stats = exitStats({
      voterCount: 0,
      messages: [],
      reactions: {},
      leaderboard: [],
    });
    const text = goodbyeMessage(room, url, stats);
    expect(text).not.toContain("❤️");
    expect(text).not.toContain("👑");
  });
});

describe("whatsappLink", () => {
  it("encodes the text", () => {
    expect(whatsappLink("שלום & ביי")).toBe(
      `https://wa.me/?text=${encodeURIComponent("שלום & ביי")}`,
    );
  });
});

describe("codeMessage", () => {
  it("gives the code and how to use it", () => {
    const text = strip(codeMessage("דוד", "K7P2QX", url));
    expect(text).toContain("הקוד שלך לחדר: K7P2QX");
    expect(text).toContain(`כותבים דוד ואז את הקוד: ${url}`);
  });
});

describe("adminLinkMessage", () => {
  it("carries the admin link and a warning", () => {
    const text = strip(adminLinkMessage("צוות מוצר", `${url}/admin#k=abc`));
    expect(text).toContain("לא לשלוח לקבוצה");
    expect(text).toContain(`${url}/admin#k=abc`);
  });
});
