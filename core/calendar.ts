import { g } from "@/core/hebrew";
import type { Room } from "@/core/types";

export type CalendarEvent = {
  uid: string;
  title: string;
  details: string;
  url: string;
  start: number;
  end: number;
};

const EVENT_MINUTES = 15;
const ALARM_MINUTES = 10;

/** The exit, as a short event at the locked hour. Null until the hour is locked. */
export function exitEvent(room: Room, url: string): CalendarEvent | null {
  if (!room.locked_slot) return null;
  const start = Date.parse(room.locked_slot);
  return {
    uid: `${room.id}@exit-the-group`,
    title: `${room.host_name} ${g(room.host_gender, "יוצא", "יוצאת")} מ${room.group_name} 🫡`,
    details: `הקבוצה החליטה. בואו לראות את זה קורה בשידור חי: ${url}`,
    url,
    start,
    end: start + EVENT_MINUTES * 60_000,
  };
}

/** 20261015T150000Z */
function utcStamp(ms: number) {
  return new Date(ms)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${utcStamp(event.start)}/${utcStamp(event.end)}`,
    details: event.details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** RFC 5545 lines are at most 75 octets; longer ones continue on a line starting with a space. */
function fold(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = parts.length === 0 ? 75 : 74; // continuation lines lose one octet to the space
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** An .ics file with one event and a reminder ten minutes before. */
export function icsFile(event: CalendarEvent, now = Date.now()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//exit-the-group//exit//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(event.start)}`,
    `DTEND:${utcStamp(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.details)}`,
    `URL:${event.url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `TRIGGER:-PT${ALARM_MINUTES}M`,
    `DESCRIPTION:${escapeText(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
