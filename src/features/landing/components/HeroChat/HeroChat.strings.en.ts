import type { StringsOf } from "@/core/i18n/strings.types";
import type { heroChatStrings } from "./HeroChat.strings";

export const heroChatStringsEn: StringsOf<typeof heroChatStrings> = {
  group: "Product team",
  me: "you",
  members: "{dana}, {yossi}, {noa}, {host} and 36 others",
  typing: "{name} is typing…",
  system: "The group voted. Leaving in",
  senders: {
    dana: "Dana",
    yossi: "Yossi from finance",
    noa: "Noa from HR",
    avi: "Avi (boss)",
  },
  not: {
    fired: "I wasn't fired",
    quit: "I didn't resign",
    fed_up: "I'm not just fed up",
  },
  openers: {
    fired: {
      a: {
        l1: "I heard what happened 😢 Sending a hug",
        l2: "So are you staying in the group or...?",
        l3: "I have no idea when to leave without making it awkward 🫠",
      },
      b: {
        l1: "Team, quick update: today is a dear colleague's last day 🙏",
        l2: "Wait what?? Who???",
        l3: "...me 🙃",
        l4: "Avi, ever heard of a private message? 😬",
      },
      c: {
        l1: "Reminder: laptop and badge back by end of day 🙂",
        l2: "Noa, that... went to the whole group",
        l3: "Oops 🙈",
        l4: "Oh no 😢 What happened??",
      },
    },
    quit: {
      a: {
        l1: "Hey everyone, so... I resigned 🫡",
        l2: "What?! Really?! 😱 Congrats!",
        l3: "Who's bringing pastries on Thursday now?",
        l4: "Now we just need to decide when I leave the group 😏",
      },
      b: {
        l1: "Okay, time to say it: I handed in my resignation 📝",
        l2: "Already? I thought we'd talk on Sunday 😅",
        l3: "So proud of you!!! 🥹",
        l4: "Where to? Do they have room for one more? 👀",
      },
      c: {
        l1: "Did anyone see the LinkedIn post?? 👀",
        l2: "“Excited to announce…” 😂",
        l3: "Okay okay, yes. I'm leaving 🫡",
        l4: "So shall we book your exit interview? 🙂",
      },
    },
    fed_up: {
      a: {
        l1: "Who took my yogurt from the fridge??",
        l2: "Reminder: standup tomorrow at 8:00 🙃",
        l3: "That's it. I've had enough. Time to leave this group 💅",
        l4: "Wait, at least let us vote on when 🍿",
      },
      b: {
        l1: "Anyone who hasn't filled in the weekly report: today by 17:00 ‼️",
        l2: "Again? We did it yesterday",
        l3: "This is the report on the report",
        l4: "That's it. I'm out of this group 💅",
        l5: "Wait! First we vote on when 🍿",
      },
      c: {
        l1: "Great news: every meeting now opens with a breathing exercise 🧘",
        l2: "I breathe just fine, thanks. Bye 💅",
        l3: "Wait, is there drama? 🍿",
        l4: "There's drama. Bring popcorn",
      },
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
  chatter: {
    fired: {
      c1: "You'll find something better, I promise 💪",
      c2: "Who's taking over their kitchen duty now? 🤔",
      c3: "Our door is always open 🙏",
      c4: "Except the parking gate. They already changed the code",
      c5: "I'm organising you a farewell. No arguments 🎉",
      c6: "Thanks everyone, really ❤️",
      c7: "Reminder: the boxes are by the elevator 📦",
      c8: "Noa!!!",
      c9: "Someone already took your chair, just so you know",
      c10: "At least no more 8:00 standups 😌",
    },
    quit: {
      c1: "We need a farewell lunch. I'm booking a table 🍣",
      c2: "Who gets your big monitor?",
      c3: "Good luck at the new place, honestly 🙏",
      c4: "Sending the offboarding form, sign by Tuesday 📋",
      c5: "If they need someone in marketing, I'm just saying 👀",
      c6: "I'll miss the coffee here. Only the coffee 😏",
      c7: "Traitor 😂🫡",
      c8: "Your letter was touching, by the way",
      c9: "Promise we'll keep meeting up 🥺",
      c10: "From now on you're just a LinkedIn connection 😢",
    },
    fed_up: {
      c1: "Is anyone still on the yogurt case, or is it closed?",
      c2: "I'm only here for the drama 🍿",
      c3: "Let's keep it respectful in the group 🙏",
      c4: "I'll keep it respectful. From outside 💅",
      c5: "Reminder: you can come to me about anything 💛",
      c6: "Noa, so who took the yogurt?",
      c7: "I can't breathe 😂😂",
      c8: "Team meeting tomorrow at 7:30. Attendance mandatory",
      c9: "And that's exactly why 👆",
      c10: "Fair. I'd join you, but I have a mortgage 🫠",
    },
  },
};
