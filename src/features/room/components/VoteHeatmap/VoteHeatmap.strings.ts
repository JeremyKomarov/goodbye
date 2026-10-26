export const voteHeatmapStrings = {
  title: "{isOpen, select, true {באיזו שעה לצאת?} other {התוצאות}}",
  hint: {
    pick: "בוחרים יום ושעה",
    groupDecides: "הקבוצה מחליטה",
    closed: "ההצבעה סגורה",
  },
  days: "ימים",
  hoursOf: "השעות של {day}",
  cell:
    "{when}, {votes}" +
    "{mine, select, true {, הקול שלך} other {}}" +
    "{winner, select, true {, הנבחר} other {}}",
  you: "את/ה",
  someone: "מישהו",
  yourVote: "הקול שלך: {slot}",
  withdraw: "ביטול הקול",
  idle: {
    howTo: "לוחצים על שעה כדי להצביע. אפשר לשנות עד שההצבעה נסגרת, {closes}.",
    hostWatches:
      "{gender, select, f {את יוצאת} other {אתה יוצא}}, הם מחליטים מתי 😉 " +
      "ההצבעה נסגרת {closes}.",
    counting: "ההצבעה נסגרה, סופרים קולות…",
    leftMidVote: "{name} {gender, select, f {יצאה} other {יצא}} לפני שההצבעה נגמרה",
  },
  errors: {
    voting_closed: "ההצבעה כבר נסגרה",
    forbidden: "רק מי שבחדר מצביע, ומי שיוצא לא מצביע",
    rate_limited: "הרבה שינויים בקול בבת אחת. נסו שוב בעוד דקה",
    failed: "לא הצלחנו לשמור את הקול. נסו שוב",
  },
};
