// A room as a shared link shows it — the tab's title, the description, the preview card — telling
// the story so far: the question, then the decision, then the verdict. Names arrive as typed.
export const roomPreviewStrings = {
  title: {
    voting: "מתי {name} {gender, select, f {יוצאת} other {יוצא}} מ{group}?",
    locked: "{name} {gender, select, f {יוצאת} other {יוצא}} מ{group} {slot}",
    exited: "{name} {gender, select, f {יצאה} other {יצא}} מ{group}: {verdict}",
    notFound: "החדר לא נמצא",
  },
  description: {
    voting: "אתם מחליטים. נכנסים, בוחרים שעה, ובינתיים משחקים.",
    locked: "הקבוצה החליטה. בואו לספירה לאחור ולקיר הפרידה.",
    exited: "זהו, זה קרה. הקיר עדיין פתוח.",
  },
  // The card's pill, then its two big lines; kept short — the card cannot wrap a Hebrew line.
  card: {
    voting: {
      pill: "אתם מחליטים. נכנסים ומצביעים",
      first: "מתי {name} {gender, select, f {יוצאת} other {יוצא}}",
      second: "מ{group}?",
    },
    locked: {
      pill: "הקבוצה החליטה",
      first: "{name} {gender, select, f {יוצאת} other {יוצא}}",
      second: "{day} בשעה {time}",
    },
    exited: {
      pill: "{name} {gender, select, f {יצאה} other {יצא}} מ{group}",
      first: "ביי {name}",
    },
  },
};
