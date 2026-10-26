import type { StringsOf } from "@/core/i18n/strings.types";
import type { farewellWallStrings } from "./FarewellWall.strings";

export const farewellWallStringsEn: StringsOf<typeof farewellWallStrings> = {
  label: "Farewell wall",
  intro:
    "{status, select, " +
    "exited {{name} already left the group, but the wall is still open. Anything else to say?} " +
    "other {{theme, select, " +
    "fired {What goes in {name}'s box? A memory, a thank-you, a good word for the next " +
    "interview. Everyone in the room sees the messages.} " +
    "quit {Sign {name}'s farewell card: what you'll remember, and what {gender, select, " +
    "f {she} other {he}} should know before going. Everyone in the room sees the messages.} " +
    "fed_up {Front-row seats to the drama 🍿 What do you want to tell {name} before the big " +
    "exit? Everyone in the room sees the messages.} " +
    "other {What would you like to tell {name} before {gender, select, f {she leaves} " +
    "other {he leaves}}? Everyone in the room sees the messages.}}}}",
  empty: "No messages yet. The first one will be yours.",
  jump:
    "{count, plural, " +
    "=0 {Jump to the latest message} " +
    "one {One new message, jump to the latest} " +
    "other {# new messages, jump to the latest}}",
  quickEmoji: "Rain {emoji} on everyone in the room",
  composer: {
    label: "Goodbye message",
    send: "Send",
  },
  errors: {
    too_fast: "Please wait a few seconds before sending another message",
    forbidden: "Only people in the room can write on the wall",
    rate_limited: "That's a lot of messages at once. You can send more in a few minutes",
    failed: "We couldn't send that. Try again",
  },
};
