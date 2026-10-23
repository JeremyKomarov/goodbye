import type { StringsOf } from "@/core/i18n/strings.types";
import type { gameScreenStrings } from "./GameScreen.strings";

export const gameScreenStringsEn: StringsOf<typeof gameScreenStrings> = {
  back: "Back to the games",
  result: {
    roomRecord: "New room record 👑",
    personalBest: "New personal best",
    yours: "Your score",
    first: "You're first on the board",
    place: "Place {rank} of {total}",
    again: "Another round",
    all: "All games",
    closed: "The games have closed, so this score wasn't kept",
    failed: "Couldn't save the score",
  },
};
