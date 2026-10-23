// Splitting a duration for words. Ported from the original's formatDuration and
// formatDurationRough; the words themselves are the `time` namespace's `duration`.

export const DURATION_UNITS = { days: "days", hours: "hours", minutes: "minutes" } as const;
export type DurationUnit = (typeof DURATION_UNITS)[keyof typeof DURATION_UNITS];

export interface DurationPart {
  unit: DurationUnit;
  count: number;
}

/** Up to two units, largest first — "2 days and 3 hours", "an hour and 5 minutes". [] under one. */
export function exactParts(ms: number): DurationPart[] {
  const total = Math.max(0, Math.round(Math.abs(ms) / 60_000));
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const minutes = total % 60;
  const parts: DurationPart[] =
    days > 0
      ? [{ unit: DURATION_UNITS.days, count: days }, { unit: DURATION_UNITS.hours, count: hours }]
      : hours > 0
        ? [
            { unit: DURATION_UNITS.hours, count: hours },
            { unit: DURATION_UNITS.minutes, count: minutes },
          ]
        : [{ unit: DURATION_UNITS.minutes, count: minutes }];
  return parts.filter((part) => part.count > 0);
}

/** One unit, rounded: minutes under 90, hours under 48, then days. Null under a minute. */
export function roughPart(ms: number): DurationPart | null {
  const minutes = Math.round(Math.abs(ms) / 60_000);
  if (minutes < 1) return null;
  if (minutes < 90) return { unit: DURATION_UNITS.minutes, count: minutes };
  const hours = Math.round(minutes / 60);
  if (hours < 48) return { unit: DURATION_UNITS.hours, count: hours };
  return { unit: DURATION_UNITS.days, count: Math.round(hours / 24) };
}

export interface DurationWords {
  /** One part in words: "5 minutes". */
  part: (part: DurationPart) => string;
  /** Two parts joined: "an hour and 5 minutes". */
  pair: (first: string, second: string) => string;
  underMinute: string;
}

/** `exact` and `rough` in words. Read through `useDuration` on screen, directly elsewhere. */
export function durationWords(words: DurationWords) {
  return {
    exact: (ms: number) => {
      const [first, second] = exactParts(ms).map(words.part);
      if (!first) return words.underMinute;
      return second ? words.pair(first, second) : first;
    },
    rough: (ms: number) => {
      const part = roughPart(ms);
      return part ? words.part(part) : words.underMinute;
    },
  };
}
