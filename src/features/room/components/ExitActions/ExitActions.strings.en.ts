import type { StringsOf } from "@/core/i18n/strings.types";
import type { exitActionsStrings } from "./ExitActions.strings";

export const exitActionsStringsEn: StringsOf<typeof exitActionsStrings> = {
  calendar: {
    open: "Add to calendar",
    title: "Add to calendar",
    note: "A reminder ten minutes before, with the room's link, to watch the exit live.",
    google: "Google Calendar",
    file: "iPhone, Mac or Outlook",
  },
};
