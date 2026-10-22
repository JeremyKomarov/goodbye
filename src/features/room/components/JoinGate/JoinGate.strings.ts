export const joinGateStrings = {
  label: "כניסה לחדר",
  headline:
    "{status, select, " +
    "voting {מתי {name} {gender, select, f {צריכה לצאת} other {צריך לצאת}} מהקבוצה?} " +
    "locked {{name} {gender, select, f {יוצאת} other {יוצא}} מהקבוצה} " +
    "other {{name} {gender, select, f {כבר יצאה} other {כבר יצא}} מהקבוצה}}",
  because: "{name} {reason}.",
  youDecide: "אתם מחליטים באיזו שעה.",
  voted: "{count, plural, one {אדם אחד כבר הצביע.} other {# אנשים כבר הצביעו.}}",
  wallOpen: "הקיר עוד פתוח, ואפשר להשאיר ל{name} הודעת פרידה.",
  nameLabel: "איך קוראים לך? ככה יראו אותך בחדר",
  enter: "כניסה לחדר",
  errors: {
    name: "צריך שם, עד 24 תווים",
    nameTaken: "כבר יש בחדר מישהו בשם הזה. אפשר לבחור שם אחר",
    hostName: "זה השם של {host}. אם זה את/ה, פותחים כאן את קישור הניהול שלך.",
    failed: "לא הצלחנו להכניס אותך. נסו שוב",
  },
};
