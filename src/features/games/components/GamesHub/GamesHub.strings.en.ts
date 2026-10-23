import type { StringsOf } from "@/core/i18n/strings.types";
import type { gamesHubStrings } from "./GamesHub.strings";

export const gamesHubStringsEn: StringsOf<typeof gamesHubStrings> = {
  label: "The games",
  blurb: {
    runaway: "The button runs away. How fast can you catch it?",
    trivia: "10 questions about WhatsApp, offices and people who got fired and made it",
    catch: "Pop the notifications before they bury you. Just not the boss",
    picture: "You see a quarter of the picture and you're sure it's obvious. Then you see the rest",
  },
  record: {
    mine: "Your record",
    none: "No record yet",
    myBest: "Your best: {score}",
  },
};
