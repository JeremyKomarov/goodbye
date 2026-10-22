// The wizard's own words, read by the form and by its step partials. `fields` and `codes` are what
// it says when something is wrong: the schema and the handler say *which* field (03-DATA.md §4),
// this says what the host reads.
export const landingStrings = {
  wizard: {
    steps: {
      reason: { title: "למה יוצאים?", sub: "בוחרים סיפור, והצ׳אט כבר מגיב 👀" },
      who: { title: "מי יוצא?", sub: "ככה זה ייראה בקבוצה" },
      when: { title: "מתי?", sub: "אתם בוחרים חלון, הקבוצה בוחרת שעה" },
    },
    back: "חזרה",
    next: "הבא",
    skip: "דילוג",
    create: "פתיחת חדר הצבעה 🗳️",
  },
  fields: {
    hostName: "צריך שם, עד 30 תווים",
    groupName: "צריך את שם הקבוצה, עד 60 תווים",
    windowStart: "צריך לבחור יום",
    dayEndHour: "שעת הסיום צריכה להיות אחרי שעת ההתחלה",
    votingClosesAt: "צריך לבחור מתי ההצבעה נסגרת",
  },
  codes: {
    close_time_in_past: "ההצבעה צריכה להיסגר בעתיד, לפחות בעוד דקה",
    no_slots_after_close:
      "אין אף שעה להצבעה אחרי סגירת ההצבעה. כדאי להאריך את הימים או לסגור את ההצבעה מוקדם יותר",
    invalid_input: "משהו בטופס לא תקין",
    failed: "לא הצלחנו לפתוח את החדר. נסו שוב",
  },
};
