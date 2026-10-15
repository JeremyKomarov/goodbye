import { describe, expect, it } from "vitest";
import { exitEvent, googleCalendarUrl, icsFile } from "@/core/calendar";
import { makeRoom } from "@/core/test/room";

const room = makeRoom({ status: "locked", locked_slot: "2026-11-10T16:00:00Z" });
const url = "https://example.com/r/abc12345";

describe("exitEvent", () => {
  it("waits for a locked hour", () => {
    expect(exitEvent(makeRoom(), url)).toBeNull();
  });

  it("is a short event at the locked hour", () => {
    const event = exitEvent(room, url)!;
    expect(event.title).toBe("ג׳רמי יוצא מצוות מוצר 🫡");
    expect(event.end - event.start).toBe(15 * 60_000);
  });
});

describe("googleCalendarUrl", () => {
  it("passes the times in UTC", () => {
    const link = new URL(googleCalendarUrl(exitEvent(room, url)!));
    expect(link.searchParams.get("dates")).toBe("20261110T160000Z/20261110T161500Z");
  });
});

describe("icsFile", () => {
  const ics = icsFile(exitEvent(room, url)!, Date.parse("2026-11-01T00:00:00Z"));

  it("uses CRLF and the event's UTC times", () => {
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics).toContain("\r\nDTSTART:20261110T160000Z\r\n");
    expect(ics).toContain("\r\nTRIGGER:-PT10M\r\n");
  });

  it("folds lines at 75 octets without splitting characters", () => {
    const encoder = new TextEncoder();
    for (const line of ics.split("\r\n")) expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    // Unfolding gives back the escaped description.
    const unfolded = ics.replace(/\r\n /g, "");
    expect(unfolded).toContain(`DESCRIPTION:הקבוצה החליטה. בואו לראות את זה קורה בשידור חי: ${url}`);
  });
});
