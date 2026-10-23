import type { StringsOf } from "@/core/i18n/strings.types";
import type { runawayGameStrings } from "./RunawayGame.strings";

export const runawayGameStringsEn: StringsOf<typeof runawayGameStrings> = {
  intro: "The red button runs away from you. Catch it as fast as you can.",
  start: "Start",
  tiring: "The button tires with every escape",
  dodges: "Dodges: {count}",
  elapsed: "{seconds}s",
  taunt: {
    exit: "Exit group",
    notYet: "Not yet!",
    oneMore: "Wait, one more message",
    morning: "Good morning 🌸",
    tomorrow: "Maybe tomorrow?",
    minutes: "Who'll write up the meeting?",
    almost: "Almost!",
    meme: "Just one more meme",
    comeOn: "Oh come on",
    gotIt: "Got me? Nope.",
    needIt: "I still need this group",
    pizza: "Wait for Thursday's pizza",
  },
};
