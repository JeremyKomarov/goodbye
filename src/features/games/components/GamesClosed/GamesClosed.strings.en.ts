import type { StringsOf } from "@/core/i18n/strings.types";
import type { gamesClosedStrings } from "./GamesClosed.strings";

export const gamesClosedStringsEn: StringsOf<typeof gamesClosedStrings> = {
  title: "🏁 The games are closed",
  board: "See the records",
  body: "{name} left the group, so the records stay as they are. Whoever's on top stays there 👑",
};
