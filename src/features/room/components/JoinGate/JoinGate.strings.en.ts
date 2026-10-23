import type { StringsOf } from "@/core/i18n/strings.types";
import type { joinGateStrings } from "./JoinGate.strings";

export const joinGateStringsEn: StringsOf<typeof joinGateStrings> = {
  label: "Join the room",
  headline:
    "{status, select, " +
    "voting {{theme, select, " +
    "fired {When does {name} carry the box out of the group?} " +
    "quit {When does {name} hand the group {gender, select, f {her} other {his}} resignation?} " +
    "fed_up {When does {name} make the big dramatic exit?} " +
    "other {When should {name} leave the group?}}} " +
    "locked {{name} is leaving the group} " +
    "other {{name} already left the group}}",
  because: "{name} {reason}.",
  youDecide: "You pick the hour.",
  voted: "{count, plural, one {One person has voted.} other {# people have voted.}}",
  wallOpen: "The wall is still open — leave {name} a goodbye.",
  nameLabel: "What's your name? It's how the room will see you",
  enter: "Enter the room",
  code: {
    question: "{name} is already in the room. Is that you, on another device?",
    label: "{name}'s code",
    helper:
      "You'll find the code on the device you joined from: tap \"Hi {name}\" at the top of the " +
      "room. Lost it, and the device too? {host} can send it to you.",
    enter: "Come in as {name}",
    notMe: "That's not me, I'll pick another name",
  },
  errors: {
    name: "A name is needed, up to 24 characters",
    hostName: "That's {host}'s name. If it's you, open your admin link here.",
    failed: "We couldn't let you in. Refresh the page and try again",
    code: "The code is needed",
    not_found: "No one with that name is in this room",
    wrong_login_code: "That code doesn't match. Check it on your first device",
    too_many_attempts: "Too many attempts. Try again in a few minutes",
  },
};
