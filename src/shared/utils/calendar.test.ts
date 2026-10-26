import { describe, expect, it } from "vitest";
import { exitEvent, googleCalendarUrl, icsFile } from "./calendar";

const url = "https://example.com/r/abc12345";
const words = {
  title: "ג׳רמי יוצא מצוות מוצר 🫡",
  details: `הקבוצה החליטה. בואו לראות את זה קורה בשידור חי: ${url}`,
};
const room = { id: "room-1", lockedSlot: Date.parse("2026-11-10T16:00:00Z") };
const event = exitEvent(room, words, url)!;

describe("exitEvent", () => {
  it("waits for a locked hour", () => {
    expect(exitEvent({ ...room, lockedSlot: null }, words, url)).toBeNull();
  });

  it("is a short event at the locked hour", () => {
    expect(event.title).toBe(words.title);
    expect(event.end - event.start).toBe(15 * 60_000);
  });
});

describe("googleCalendarUrl", () => {
  it("passes the times in UTC", () => {
    const link = new URL(googleCalendarUrl(event));
    expect(link.searchParams.get("dates")).toBe(
      "20261110T160000Z/20261110T161500Z",
    );
  });
});

describe("icsFile", () => {
  const ics = icsFile(event, Date.parse("2026-11-01T00:00:00Z"));

  it("uses CRLF and the event's UTC times", () => {
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics).toContain("\r\nDTSTART:20261110T160000Z\r\n");
    expect(ics).toContain("\r\nTRIGGER:-PT10M\r\n");
  });

  it("folds lines at 75 octets without splitting characters", () => {
    const encoder = new TextEncoder();
    for (const line of ics.split("\r\n"))
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    // Unfolding gives back the escaped description.
    expect(ics.replace(/\r\n /g, "")).toContain(`DESCRIPTION:${words.details}`);
  });

  it("escapes what RFC 5545 reserves in text: backslash, semicolon, comma, newline", () => {
    const typed = { ...event, title: "Dan; Ruth, \\o/\nbye" };
    const unfolded = icsFile(typed, Date.parse("2026-11-01T00:00:00Z")).replace(
      /\r\n /g,
      "",
    );
    expect(unfolded).toContain("SUMMARY:Dan\\; Ruth\\, \\\\o/\\nbye\r\n");
  });
});
