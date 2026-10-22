// The room's status card: the vote's countdown, then the countdown to the chosen hour, then how
// the exit went. Gendered by the host.
export const heroStrings = {
  label: "מצב החדר",
  days: "{count, plural, one {יום אחד ו-} two {יומיים ו-} other {# ימים ו-}}",
  voting: {
    because: "{name} {reason}.",
    deciding:
      "עכשיו הקבוצה מחליטה מתי {gender, select, f {היא יוצאת} other {הוא יוצא}} מ{group}.",
    closesIn: "{counting, select, true {סופרים קולות…} other {ההצבעה נסגרת בעוד}}",
    tie: "תיקו בין {count} שעות",
    tied:
      "{slots}{more, plural, =0 {} other { ועוד #}}, עם {votes} כל אחת. " +
      "{counting, select, true {ההגרלה מכריעה…} other {אם זה יישאר ככה, הגרלה תכריע.}}",
    leading: "מובילה כרגע: {slot}, עם {votes} מתוך {voters}.",
    noVotes: "עוד אף אחד לא הצביע. בחרו שעה בטבלה.",
  },
  locked: {
    leavesIn:
      "{overtime, select, " +
      "true {הגיע הזמן! עברו כבר} " +
      "other {{name} {gender, select, f {יוצאת} other {יוצא}} מהקבוצה בעוד}}",
    waiting: "עכשיו רק מחכים ש{name} {gender, select, f {תצא} other {יצא}} 👀",
    drawn: "{slot}. היה תיקו בין {count} שעות, וההגרלה בחרה בזו 🎲",
    decided: "{slot}. ככה החליטה הקבוצה, עם {votes}.",
    decidedPlain: "{slot}. ככה החליטה הקבוצה.",
  },
  exitRow: {
    label: "יציאה מהקבוצה",
  },
  exited: {
    left: "{name} {gender, select, f {יצאה} other {יצא}} מהקבוצה",
    verdict:
      "{kind, select, " +
      "on_time {בדיוק בזמן} " +
      "late {{gender, select, f {איחרה} other {איחר}} ב-{by}} " +
      "early {{gender, select, f {ברחה} other {ברח}} {by} מוקדם} " +
      "other {{gender, select, f {ברחה} other {ברח}} באמצע ההצבעה}}",
  },
};
