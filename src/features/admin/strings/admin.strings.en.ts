import type { StringsOf } from "@/core/i18n/strings.types";
import type { adminStrings } from "./admin.strings";

export const adminStringsEn: StringsOf<typeof adminStrings> = {
  title: "Manage the room",
  back: "Back to the room",
  private: "Only someone with the admin link sees this page. Don't send it to the group.",
  checking: "Checking the admin link…",
  denied: "This admin link doesn't work. Check that it was copied whole",
  failed: "We couldn't load the room. Try again",
  status: {
    title: "Right now",
    voting: "Voting is open until {slot}",
    locked: "The hour is set: {slot}",
    exited: "You left at {time}",
  },
  exit: {
    action: "I left the group",
    whenLocked:
      "When the hour comes: leave the group in WhatsApp, then tap here (or the red row in the " +
      "room). Everyone in the room sees it live.",
    whenVoting:
      "You can leave right now, mid-vote. Voting closes with no hour, and everyone sees you " +
      "didn't wait for the result.",
    askMidVote: "Voting is still open. Leave right now? Everyone will see you ran off mid-vote 😅",
    askEarly:
      "{left} until the hour the group chose. Mark that you left now? Everyone will see you " +
      "ran off early 😅",
    ask: "Mark that you left the group? Everyone will see it right away.",
    undo: "Undo the exit",
    askUndo:
      "{hasHour, select, true {Undo the exit and go back to the countdown?} " +
      "other {Undo the exit? Voting opens again.}}",
  },
  lock: {
    action: "Close voting now",
    ask: "Close voting now? The leading hour will be chosen.",
  },
  reopen: {
    label: "{isVoting, select, true {Change when voting closes} other {Open voting again, until}}",
    action: "{isVoting, select, true {Update the closing time} other {Reopen}}",
  },
  forget: {
    action: "Forget admin on this device",
    help: "For a shared computer. The admin link brings you back any time.",
  },
  wall: {
    title: "Messages on the wall",
    refresh: "Refresh",
    empty: "No messages yet.",
    delete: "Delete",
    ask: "Delete this message?",
  },
  codes: {
    title: "Codes for other devices",
    help: "Joining from another device takes a name, then the code. Forgot it? Send it from here.",
    empty: "Nobody has joined yet.",
    pending: "The code is made the next time they open the room",
    send: "Send",
    sendTo: "Send {name} their code on WhatsApp",
    message:
      "Hi {name} 👋 your code for the room: {code}\n" +
      "Open it here, type {name}, then the code: {url}",
  },
  link: {
    title: "Your admin link",
    help:
      "To manage the room from another device, send the link to yourself. Whoever has it can " +
      "close the vote and mark your exit, so don't send it to the group.",
    send: "Send it to myself on WhatsApp",
    message: "My admin link for the {group} room (don't send it to the group): {url}",
  },
  share: {
    title: "Send to the group",
    exited: "The goodbye message",
  },
  errors: {
    close_time_in_past: "The closing time has to be in the future",
    no_slots_after_close: "There are no hours to vote on after that time",
    failed: "That didn't work. Try again",
  },
};
