import type { StringsOf } from "@/core/i18n/strings.types";
import type { voteHeatmapStrings } from "./VoteHeatmap.strings";

export const voteHeatmapStringsEn: StringsOf<typeof voteHeatmapStrings> = {
  title: "{isOpen, select, true {What time should they leave?} other {The results}}",
  hint: {
    pick: "Pick a day and an hour",
    groupDecides: "The group decides",
    closed: "Voting is closed",
  },
  days: "Days",
  hoursOf: "Hours on {day}",
  cell:
    "{when}, {votes}" +
    "{mine, select, true {, your vote} other {}}" +
    "{winner, select, true {, the pick} other {}}",
  you: "you",
  someone: "someone",
  yourVote: "Your vote: {slot}",
  withdraw: "Take back my vote",
  idle: {
    howTo: "Tap an hour to vote. You can change it until voting closes, {closes}.",
    hostWatches: "You're the one leaving — they decide when 😉 Voting closes {closes}.",
    counting: "Voting has closed, counting the votes…",
    leftMidVote: "{name} left before the vote was over",
  },
  errors: {
    voting_closed: "Voting has already closed",
    forbidden: "Only people in the room vote, and the one leaving doesn't",
    rate_limited: "That's a lot of vote changes at once. Try again in a minute",
    failed: "We couldn't save your vote. Try again",
  },
};
