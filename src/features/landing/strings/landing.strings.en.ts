import type { StringsOf } from "@/core/i18n/strings.types";
import type { landingStrings } from "./landing.strings";

export const landingStringsEn: StringsOf<typeof landingStrings> = {
  wizard: {
    steps: {
      reason: { title: "Why leave?", sub: "Pick a story and watch the chat react 👀" },
      who: { title: "Who's leaving?", sub: "This is how it will appear in the group" },
      when: { title: "When?", sub: "You pick the window; the group picks the time" },
    },
    back: "Back",
    next: "Next",
    skip: "Skip",
    create: "Create voting room 🗳️",
  },
  fields: {
    hostName: "Your name is needed, up to 30 characters",
    groupName: "The group's name is needed, up to 60 characters",
    windowStart: "Choose a day",
    dayEndHour: "The end time must be after the start time",
    votingClosesAt: "Choose when voting closes",
  },
  codes: {
    close_time_in_past: "Voting has to close in the future, at least a minute from now",
    no_slots_after_close:
      "No hours are left to vote on after voting closes. Add days or close voting earlier",
    invalid_input: "Something in the form isn't right",
    rate_limited: "A lot of rooms were opened from here in the last hour. Try again in an hour",
    failed: "We couldn't open the room. Try again",
  },
};
