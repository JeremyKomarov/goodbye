import type { StringsOf } from "@/core/i18n/strings.types";
import type { siteStrings } from "./site.strings";

export const siteStringsEn: StringsOf<typeof siteStrings> = {
  name: "When do I leave the group?",
  shortName: "Exit group",
  description:
    "Open a room, send the link to the group, and everyone votes on the hour you leave it.",
  card: {
    pill: "The group decides, you leave",
    first: "When do I",
    second: "leave the group?",
    badge: "Exit group",
  },
};
