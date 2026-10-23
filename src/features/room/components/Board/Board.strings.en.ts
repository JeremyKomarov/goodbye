import type { StringsOf } from "@/core/i18n/strings.types";
import type { boardStrings } from "./Board.strings";

export const boardStringsEn: StringsOf<typeof boardStrings> = {
  label: "The records",
  hours: {
    title: "Most wanted hours",
    none: "No votes yet.",
  },
  games: {
    nobody: "Nobody played.",
    notYet: "Nobody has played yet.",
    playFirst: "Play first",
    you: "(you)",
  },
};
