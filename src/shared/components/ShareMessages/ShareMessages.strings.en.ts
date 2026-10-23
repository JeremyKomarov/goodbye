import type { StringsOf } from "@/core/i18n/strings.types";
import type { shareMessagesStrings } from "./ShareMessages.strings";

export const shareMessagesStringsEn: StringsOf<typeof shareMessagesStrings> = {
  voters: "{count, plural, one {One person voted} other {# voted}}",
  goodbyes: "{count, plural, one {one goodbye} other {# goodbyes}}",
  result: {
    title: "The group decided",
    when: "Send when voting locks",
    decided: "🗳️ The group decided: {name} leaves the group {slot}",
    drawn: " (it was a tie, and the draw picked 🎲)",
    where: "{voters}. Countdown, games and a farewell wall here: {url}",
  },
  goodbye: {
    title: "Goodbye message",
    when: "Send just before you leave",
    leaving: "👋 That's it, it's time. I'm leaving the group{at}.",
    at: " at the hour you chose, {time}",
    counts: "🗳️ {voters} · 💬 {goodbyes}",
    loved: "❤️ The most loved message: \"{body}\" ({name})",
    champion: "👑 {game}: {name}",
    thanks: "Thanks for everything! The wall stays open: {url}",
  },
  send: "Send on WhatsApp",
  hint: "WhatsApp opens with the message ready. Pick the group and tap send.",
  loading: "Counting the votes and goodbyes…",
};
