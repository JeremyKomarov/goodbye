import type { StringsOf } from "@/core/i18n/strings.types";
import type { heroChatStrings } from "./HeroChat.strings";

export const heroChatStringsEn: StringsOf<typeof heroChatStrings> = {
  group: "Product team",
  me: "you",
  members: "{dana}, {yossi}, {host} and 37 others",
  system: "The group voted. Leaving in",
  senders: {
    dana: "Dana",
    yossi: "Yossi from finance",
  },
  not: {
    fired: "I wasn't fired",
    quit: "I didn't resign",
    fed_up: "I'm not just fed up",
  },
  openers: {
    fired: {
      l1: "I heard what happened 😢 Sending a hug",
      l2: "So are you staying in the group or...?",
      l3: "I have no idea when to leave without making it awkward 🫠",
    },
    quit: {
      l1: "Hey everyone, so... I resigned 🫡",
      l2: "What?! Really?! 😱 Congrats!",
      l3: "Who's bringing pastries on Thursday now?",
      l4: "Now we just need to decide when I leave the group 😏",
    },
    fed_up: {
      l1: "Who took my yogurt from the fridge??",
      l2: "Reminder: standup tomorrow at 8:00 🙃",
      l3: "That's it. I've had enough. Time to leave this group 💅",
      l4: "Wait, at least let us vote on when 🍿",
    },
  },
  corrections: {
    fired: {
      l1: "No, {not}. The truth is, I was fired 🙃",
      l2: "Oh no 😢 Sending a big hug",
      l3: "Wait, so what's actually true??",
    },
    quit: {
      l1: "Hold on, {not}. I resigned! 🫡",
      l2: "Whaaat?? Congrats!! 🥳",
      l3: "Okay, I'm completely confused now 😵‍💫",
    },
    fed_up: {
      l1: "Actually, {not}. I've just had enough 💅",
      l2: "Drama! 🍿🍿",
      l3: "Finally, someone said it",
    },
  },
};
