import { describe, expect, it } from "vitest";
import { fromLocalDateTimeInput, toLocalDateInput, toLocalDateTimeInput } from "./localDateTime";

describe("local date inputs", () => {
  it("round-trips an instant through a datetime-local value, to the minute", () => {
    const ms = Date.UTC(2026, 10, 10, 14, 30);
    expect(fromLocalDateTimeInput(toLocalDateTimeInput(ms))).toBe(new Date(ms).toISOString());
  });

  it("writes the shapes the inputs accept", () => {
    const ms = Date.UTC(2026, 0, 5, 12);
    expect(toLocalDateInput(ms)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(toLocalDateTimeInput(ms)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it("answers empty for nothing, or for something unreadable", () => {
    expect(fromLocalDateTimeInput("")).toBe("");
    expect(fromLocalDateTimeInput("tomorrow-ish")).toBe("");
  });
});
