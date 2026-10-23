import type { StringsOf } from "@/core/i18n/strings.types";
import type { finaleStrings } from "./Finale.strings";

export const finaleStringsEn: StringsOf<typeof finaleStrings> = {
  stats: {
    chosen: "{drawn, select, true {The chosen hour (by draw)} other {The chosen hour}}",
    leading: "Leading the vote",
    exitedAt: "Actually left",
    voters: "Voted",
    goodbyes: "Goodbyes",
  },
  loved: "❤️ The most loved message · {count, plural, one {one reaction} other {# reactions}}",
  champions: "The champions",
  back: "Back to the room",
};
