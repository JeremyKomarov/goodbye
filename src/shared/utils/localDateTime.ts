import { pad } from "./countdown";

// The browser's own date inputs speak local wall time with no zone ("2026-11-10T16:00"); the API
// speaks ISO instants. These convert between the two in the visitor's timezone.

/** `YYYY-MM-DD` for a `type="date"` input. */
export function toLocalDateInput(ms: number): string {
  const date = new Date(ms);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `YYYY-MM-DDTHH:mm` for a `type="datetime-local"` input. */
export function toLocalDateTimeInput(ms: number): string {
  const date = new Date(ms);
  return `${toLocalDateInput(ms)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** A `datetime-local` value → its ISO instant; "" for an empty or unreadable value. */
export function fromLocalDateTimeInput(value: string): string {
  const ms = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(ms) ? "" : new Date(ms).toISOString();
}
