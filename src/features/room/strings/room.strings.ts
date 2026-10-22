// The room's words that more than one of its components says: why the host is leaving, and how
// many votes or people. Gendered by the host's gender, the way the original's g() picked a form.
export const roomStrings = {
  reason:
    "{reason, select, " +
    "fired {{gender, select, f {פוטרה} other {פוטר}}} " +
    "quit {{gender, select, f {התפטרה} other {התפטר}}} " +
    "other {{gender, select, f {פשוט נמאס לה} other {פשוט נמאס לו}}}}",
  votes: "{count, plural, =0 {אין קולות} one {קול אחד} other {# קולות}}",
  people: "{count, plural, one {אדם אחד} other {# אנשים}}",
  slot: "{day} ב-{time}",
  // Durations: `exact` pairs two units ("שעה ו-5 דקות"); `rough` is one, for display type, where
  // "ו-9" reads as "1-9".
  duration: {
    days: "{count, plural, one {יום} two {יומיים} other {# ימים}}",
    hours: "{count, plural, one {שעה} two {שעתיים} other {# שעות}}",
    minutes: "{count, plural, one {דקה} other {# דקות}}",
    pair: "{first} ו-{second}",
    underMinute: "פחות מדקה",
  },
};
