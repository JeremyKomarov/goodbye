import type { StringsOf } from "@/core/i18n/strings.types";
import type { heroStrings } from "./Hero.strings";

export const heroStringsEn: StringsOf<typeof heroStrings> = {
  label: "Room status",
  days: "{count, plural, one {1 day and} other {# days and}}",
  voting: {
    because: "{name} {reason}.",
    deciding:
      "Now the group decides when {gender, select, f {she leaves} other {he leaves}} {group}.",
    closesIn: "{counting, select, true {Counting the votes…} other {Voting closes in}}",
    tie: "A tie between {count} hours",
    tied:
      "{slots}{more, plural, =0 {} other { and # more}}, with {votes} each. " +
      "{counting, select, true {A draw decides…} other {If it stays this way, a draw decides.}}",
    leading: "In the lead: {slot}, with {votes} of {voters}.",
    noVotes: "Nobody has voted yet. Pick an hour below.",
  },
  locked: {
    leavesIn:
      "{overtime, select, " +
      "true {It's time! Overdue by} " +
      "other {{name} leaves the group in}}",
    waiting: "Now we just wait for {name} to leave 👀",
    drawn: "{slot}. It was a tie between {count} hours, and the draw picked this one 🎲",
    decided: "{slot}. The group decided, with {votes}.",
    decidedPlain: "{slot}. The group decided.",
  },
  exitRow: {
    label: "Exit group",
  },
  exited: {
    left: "{name} left the group",
    verdict:
      "{kind, select, " +
      "on_time {Right on time} " +
      "late {{by} late} " +
      "early {Ran off {by} early} " +
      "other {Ran off mid-vote}}",
  },
};
