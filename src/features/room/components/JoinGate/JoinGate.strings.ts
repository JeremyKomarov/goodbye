export const joinGateStrings = {
  label: "כניסה לחדר",
  headline:
    "{status, select, " +
    "voting {{theme, select, " +
    "fired {מתי {name} {gender, select, f {יוצאת} other {יוצא}} מהקבוצה עם הקרטון?} " +
    "quit {מתי {name} {gender, select, f {מגישה} other {מגיש}} לקבוצה מכתב התפטרות?} " +
    "fed_up {מתי {name} עושה יציאה דרמטית מהקבוצה?} " +
    "other {מתי {name} {gender, select, f {צריכה לצאת} other {צריך לצאת}} מהקבוצה?}}} " +
    "locked {{name} {gender, select, f {יוצאת} other {יוצא}} מהקבוצה} " +
    "other {{name} {gender, select, f {כבר יצאה} other {כבר יצא}} מהקבוצה}}",
  because: "{name} {reason}.",
  youDecide: "אתם מחליטים באיזו שעה.",
  voted: "{count, plural, one {אדם אחד כבר הצביע.} other {# אנשים כבר הצביעו.}}",
  wallOpen: "הקיר עוד פתוח, ואפשר להשאיר ל{name} הודעת פרידה.",
  nameLabel: "איך קוראים לך? ככה יראו אותך בחדר",
  enter: "כניסה לחדר",
  code: {
    question: "כבר יש בחדר {name}. זה את/ה, ממכשיר אחר?",
    label: "הקוד של {name}",
    helper:
      "את הקוד רואים במכשיר שבו נכנסת: לוחצים על \"שלום {name}\" בראש החדר. " +
      "לא זוכר/ת ואין את המכשיר? {host} {gender, select, f {יכולה} other {יכול}} לשלוח לך אותו.",
    enter: "כניסה בתור {name}",
    notMe: "זה לא אני, אבחר שם אחר",
  },
  errors: {
    name: "צריך שם, עד 24 תווים",
    hostName: "זה השם של {host}. אם זה את/ה, פותחים כאן את קישור הניהול שלך.",
    failed: "לא הצלחנו להכניס אותך. נסו לרענן את הדף",
    code: "צריך את הקוד",
    not_found: "אין בחדר מישהו בשם הזה",
    wrong_login_code: "הקוד לא מתאים. בודקים אותו שוב במכשיר הראשון",
    too_many_attempts: "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות",
  },
};
