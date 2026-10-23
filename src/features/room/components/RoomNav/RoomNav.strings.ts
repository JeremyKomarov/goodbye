// The room's sections, as tabs and as a chat list with a live line under each.
export const roomNavStrings = {
  label: "ניווט בחדר",
  vote: {
    title: "הצבעה",
    left: "{name} {gender, select, f {יצאה} other {יצא}} מהקבוצה",
    chosen: "{drawn, select, true {נבחרה בהגרלה} other {נבחרה}}: {slot}",
    tie: "⚖️ תיקו בין {count} שעות",
    leading: "מובילה: {slot}",
    none: "עוד אף אחד לא הצביע",
    voted: "{count} הצביעו",
  },
  games: {
    title: "משחקים",
    idle: "כפתור בורח, טריוויה, 99+ הודעות ומה בתמונה?",
  },
  wall: {
    title: "קיר פרידה",
    last: "{name}: {body}",
    none: "עוד אין הודעות פרידה",
  },
};
