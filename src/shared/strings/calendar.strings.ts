// The exit as a calendar event: the room's "add to calendar" and the .ics handler alike. Read
// with shared/utils/calendar.ts. `name` and `group` arrive as typed, `url` is the room's link.
export const calendarStrings = {
  title: "{name} {gender, select, f {יוצאת} other {יוצא}} מ{group} 🫡",
  details: "הקבוצה החליטה. בואו לראות את זה קורה בשידור חי: {url}",
  // The handler's answer before the hour is locked.
  notYet: "השעה עוד לא ננעלה",
};
