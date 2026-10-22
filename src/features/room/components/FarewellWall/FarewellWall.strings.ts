export const farewellWallStrings = {
  label: "קיר פרידה",
  intro:
    "{status, select, " +
    "exited {{name} {gender, select, f {כבר יצאה} other {כבר יצא}} מהקבוצה, " +
    "אבל הקיר נשאר פתוח. מה עוד תרצו להגיד?} " +
    "other {מה תרצו להגיד ל{name} לפני ש{gender, select, f {היא יוצאת} other {הוא יוצא}}? " +
    "כל מי שבחדר רואה את ההודעות.}}",
  empty: "עוד אין כאן הודעות. ההודעה הראשונה תהיה שלך.",
  jump:
    "{count, plural, " +
    "=0 {מעבר להודעה האחרונה} " +
    "one {הודעה חדשה אחת, מעבר להודעה האחרונה} " +
    "other {# הודעות חדשות, מעבר להודעה האחרונה}}",
  quickEmoji: "גשם של {emoji} לכל מי שבחדר",
  composer: {
    label: "הודעת פרידה",
    send: "שליחה",
  },
  errors: {
    too_fast: "רגע, לאט. אפשר לשלוח הודעה כל כמה שניות",
    forbidden: "רק מי שבחדר כותב על הקיר",
    failed: "לא הצלחנו לשלוח. נסו שוב",
  },
};
