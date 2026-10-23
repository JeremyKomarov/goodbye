// Hours and durations in words — the room's and the admin page's alike. Read by
// shared/hooks/useSlotFormat.ts and shared/hooks/useDuration.ts.
export const timeStrings = {
  slot: "{day} ב-{time}",
  // `exact` pairs two units ("שעה ו-5 דקות"); `rough` is one, for display type, where "ו-9" reads
  // as "1-9".
  duration: {
    days: "{count, plural, one {יום} two {יומיים} other {# ימים}}",
    hours: "{count, plural, one {שעה} two {שעתיים} other {# שעות}}",
    minutes: "{count, plural, one {דקה} other {# דקות}}",
    pair: "{first} ו-{second}",
    underMinute: "פחות מדקה",
  },
};
