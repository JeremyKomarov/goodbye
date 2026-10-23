import type { StringsOf } from "@/core/i18n/strings.types";
import type { heroChatStrings } from "./HeroChat.strings";

export const heroChatStringsEn: StringsOf<typeof heroChatStrings> = {
  group: "Product team",
  me: "you",
  label: "An example group chat, reacting to someone leaving it",
  members: "{dana}, {yossi}, {noa}, {avi}, {host} and 35 others",
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
      a: {
        l1: "No, {not}. The truth is, I was fired 🙃",
        l2: "Oh no 😢 Sending a big hug",
        l3: "Wait, so what's actually true??",
      },
      b: {
        l1: "Correction: {not}. I was fired. By email 🙃",
        l2: "...okay, maybe I'd better explain in private 😬",
        l3: "AVI!!! 😡",
      },
      c: {
        l1: "Wait, {not}. Truth is, I was fired 📦",
        l2: "Confirmed. The form's already with me 📋",
        l3: "Noa, you're not helping 😅",
      },
    },
    quit: {
      a: {
        l1: "Hold on, {not}. I resigned! 🫡",
        l2: "Whaaat?? Congrats!! 🥳",
        l3: "Okay, I'm completely confused now 😵‍💫",
      },
      b: {
        l1: "Sorry, {not}. I resigned, and it's the best thing I've done 🫡",
        l2: "I thought we'd talk about it first 😅",
        l3: "So proud of you!!! 🥂",
      },
      c: {
        l1: "Actually, {not}. I'm resigning! 🚀",
        l2: "Do they have room for one more? 👀",
        l3: "So let's book your exit interview 🙂",
      },
    },
    fed_up: {
      a: {
        l1: "Actually, {not}. I've just had enough 💅",
        l2: "Drama! 🍿🍿",
        l3: "Finally, someone said it",
      },
      b: {
        l1: "No, {not}. I've just run out of patience 💅",
        l2: "Let's keep it respectful 🙏",
        l3: "I'm only here for the drama 🍿",
      },
      c: {
        l1: "Honestly? {not}. I'm done, full stop 💅",
        l2: "Finally, someone said it 👏",
        l3: "Reminder: you can come to me about anything 💛",
      },
    },
  },
};
