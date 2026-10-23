import type { StringsOf } from "@/core/i18n/strings.types";
import type { gamesStrings } from "./games.strings";

export const gamesStringsEn: StringsOf<typeof gamesStrings> = {
  title: {
    runaway: "Catch the exit button",
    trivia: "Group chat trivia",
    catch: "99+ messages",
    picture: "What's in the picture?",
  },
  score: {
    time: "{seconds}s",
    points: "{points, number} pts",
  },
};
