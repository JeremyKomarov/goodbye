import type { StringsOf } from "@/core/i18n/strings.types";
import type { joinGateStrings } from "./JoinGate.strings";

export const joinGateStringsEn: StringsOf<typeof joinGateStrings> = {
  label: "Join the room",
  headline:
    "{status, select, " +
    "voting {When should {name} leave the group?} " +
    "locked {{name} is leaving the group} " +
    "other {{name} already left the group}}",
  because: "{name} {reason}.",
  youDecide: "You pick the hour.",
  voted: "{count, plural, one {One person has voted.} other {# people have voted.}}",
  wallOpen: "The wall is still open — leave {name} a goodbye.",
  nameLabel: "What's your name? It's how the room will see you",
  enter: "Enter the room",
  errors: {
    name: "A name is needed, up to 24 characters",
    nameTaken: "Someone in the room already has that name. Pick another",
    hostName: "That's {host}'s name. If it's you, open your admin link here.",
    failed: "We couldn't let you in. Try again",
  },
};
