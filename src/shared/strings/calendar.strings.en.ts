import type { StringsOf } from "@/core/i18n/strings.types";
import type { calendarStrings } from "./calendar.strings";

export const calendarStringsEn: StringsOf<typeof calendarStrings> = {
  title: "{name} leaves {group} 🫡",
  details: "The group decided. Come watch it happen live: {url}",
  notYet: "The hour isn't locked yet",
};
