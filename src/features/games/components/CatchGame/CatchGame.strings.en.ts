import type { StringsOf } from "@/core/i18n/strings.types";
import type { catchGameStrings } from "./CatchGame.strings";

export const catchGameStringsEn: StringsOf<typeof catchGameStrings> = {
  intro: "The notifications are falling. Pop as many as you can before they bury you.",
  rules:
    "Good-morning flowers are worth more, exit group is worth the most, " +
    "and you never tap the boss.",
  start: "Start",
  left: "{seconds}s",
  lines: {
    message: {
      flood: "99+ messages",
      anyone: "Anyone there?",
      thumbs: "👍",
      meeting: "Meeting at 9:00",
      coffee: "Who took my coffee?",
      voice: "4-min voice note",
      again: "Posting this again",
    },
    flower: {
      morning: "Good morning 🌸",
      week: "Have a good week 🌻",
      shabbat: "Shabbat shalom 🌹",
    },
    boss: {
      minute: "Boss: got a minute?",
      talk: "Boss: can we talk?",
      urgent: "Boss: URGENT!!",
    },
    exit: {
      leave: "Exit group ✨",
    },
  },
};
