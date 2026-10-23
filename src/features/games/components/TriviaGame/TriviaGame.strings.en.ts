import type { StringsOf } from "@/core/i18n/strings.types";
import type { triviaGameStrings } from "./TriviaGame.strings";

export const triviaGameStringsEn: StringsOf<typeof triviaGameStrings> = {
  intro:
    "{count} questions about WhatsApp, office life and people who got fired and made it. " +
    "{seconds} seconds a question, and a quick answer is worth more.",
  start: "Start",
  progress: "Question {number} of {count}",
  timeLeft: "Time left for this question",
  verdict: {
    timeout: "Time's up",
    right: "Right! +{points}",
    wrong: "Not this time",
  },
  next: "Next question",
  finish: "See my score",
};
