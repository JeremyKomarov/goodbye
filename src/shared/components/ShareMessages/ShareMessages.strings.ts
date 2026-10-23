// The host's messages to the group, ready to send: the decision once the hour locks, the goodbye
// just before leaving. Each message is lines joined by a newline; `name`, `body` arrive isolated.
export const shareMessagesStrings = {
  voters: "{count, plural, one {אדם אחד הצביע} other {# הצביעו}}",
  goodbyes: "{count, plural, one {הודעת פרידה אחת} other {# הודעות פרידה}}",
  result: {
    title: "הקבוצה החליטה",
    when: "לשלוח כשההצבעה ננעלת",
    decided: "🗳️ הקבוצה החליטה: {name} {gender, select, f {יוצאת} other {יוצא}} מהקבוצה {slot}",
    drawn: " (היה תיקו, וההגרלה בחרה 🎲)",
    where: "{voters}. ספירה לאחור, משחקים וקיר פרידה כאן: {url}",
  },
  goodbye: {
    title: "הודעת פרידה",
    when: "לשלוח רגע לפני שיוצאים",
    leaving: "👋 זהו, הגיע הזמן. {gender, select, f {אני יוצאת} other {אני יוצא}} מהקבוצה{at}.",
    at: " בשעה שבחרתם, {time}",
    counts: "🗳️ {voters} · 💬 {goodbyes}",
    loved: "❤️ ההודעה הכי אהובה: \"{body}\" ({name})",
    champion: "👑 {game}: {name}",
    thanks: "תודה על הכל! הקיר נשאר פתוח: {url}",
  },
  send: "שליחה בוואטסאפ",
  hint: "וואטסאפ ייפתח עם ההודעה מוכנה. בוחרים את הקבוצה ולוחצים שליחה.",
  loading: "סופרים את הקולות וההודעות…",
};
