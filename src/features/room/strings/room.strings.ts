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
};
