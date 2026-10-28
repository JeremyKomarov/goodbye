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
        l1: "Team, quokick update: today is a dear colleague's last day 🙏",
        l2: "Wait, who?? 😳",
        l3: "...me. Just found out, same as you 🙃",
        l4: "At least I won't hear about leaving the group from Avi. You're voting on that one 🗳️",
        l5: "Is “yesterday” an option? 🙂",
      },
      b: {
        l1: "Personal reminder: your laptop, badge and office plant back by 17:00 🙂",
        l2: "Noa… that went to the whole group",
        l3: "I know. Saves time 🙂",
        l4: "Wait. You got FIRED?! 😢",
        l5: "Yep. They decided about the job. You get to decide about the group 🗳️",
      },
      c: {
        l1: "Heard what happened 😢 Sending the biggest hug",
        l2: "So are you staying in the group, or…?",
        l3: "Honestly? Leaving alone is sad. Leaving by democratic vote is an event 🗳️",
        l4: "Voted. Can I have your chair?",
        l5: "I voted “never” 😭",
      },
    },
    quit: {
      a: {
        l1: "So… I resigned 🫡",
        l2: "WHAT 😱 Congrats!! I mean no. I mean congrats",
        l3: "Who's bringing pastries on Thursdays now?",
        l4: "Priorities 😑 Anyway: I resigned on my own. Leaving the group is a group decision 🗳️",
        l5: "Can we vote after one last round of pastries?",
      },
      b: {
        l1: "Has anyone seen the LinkedIn post?? 👀",
        l2: "“Thrilled to announce a new chapter…” 😂",
        l3: "Okay, yes. The job, I announced on LinkedIn. The group exit, we vote on here 🗳️",
        l4: "Found out on LinkedIn, like a stranger. Liked it, though 👍",
      },
      c: {
        l1: "Time to say it: I resigned 📝",
        l2: "So proud of you!!! 🥹 Cake? Cake.",
        l3: "Where to? Is there a referral bonus? 👀",
        l4: "One last thing: when I leave the group is your last decision about me. Use it wisely 🗳️",
        l5: "Noted. Adding it to Sunday's agenda 📅",
      },
    },
    fed_up: {
      a: {
        l1: "Who took my yogurt from the fridge?? It had my NAME on it!!",
        l2: "Reminder: standup tomorrow, 7:30 sharp 🙃",
        l3: "That's it. I'm leaving this group. In style: you vote on when 💅",
        l4: "After you return the yogurt",
      },
      b: {
        l1: "Weekly report due today by 17:00 ‼️",
        l2: "Again? We sent it yesterday",
        l3: "That was the report. This is the report on the report",
        l4: "Fine. My last report: a vote on when I leave 💅",
        l5: "Please attach your vote to the weekly report 🙏",
      },
      c: {
        l1: "Great news: every meeting now opens with a breathing exercise 🧘",
        l2: "I breathe just fine, thanks. Vote on when I leave. Deep breaths 🧘",
        l3: "Wait, is there drama? 🍿",
        l4: "My door is always open 💛 (Sun–Thu, 10:00–10:15)",
      },
    },
  },
  corrections: {
    fired: {
      a: {
        l1: "No, {not}. Truth is, I was fired 🙃",
        l2: "Oh no 😢 Hugging even harder",
        l3: "Nobody asked me when to leave the job. Let's see if you're nicer 🗳️",
        l4: "Nicer, sure. So is the parking spot free or not?",
      },
      b: {
        l1: "Correction: {not}. I was fired. By email 🙃",
        l2: "It was a very warm email 🙏",
        l3: "AVI!!! 😡",
        l4: "Easy, Dana. At least here it's a vote, not an email 🗳️",
        l5: "Can I vote by email? 🙂",
      },
      c: {
        l1: "Wait, {not}. I was fired 📦",
        l2: "Confirmed ✅ Your box is by the door",
        l3: "Noa, not now 😅",
        l4: "The box is packed. Your turn: when do I leave the group? 📦🗳️",
      },
    },
    quit: {
      a: {
        l1: "Hold on, {not}. I resigned! 🫡",
        l2: "WHAAAT 🥳 Congrats!! (I think?)",
        l3: "I need a spreadsheet to follow this group 😵‍💫",
        l4: "Add a column for the vote: when do I leave the group 🗳️",
      },
      b: {
        l1: "Sorry, {not}. I resigned, best decision of my life 🫡",
        l2: "Of your LIFE?? 😅",
        l3: "The second best one is yours: when I leave the group 🗳️",
        l4: "So proud of you!!! 🥂",
      },
      c: {
        l1: "Actually, {not}. I'm resigning! 🚀",
        l2: "Do they have room for one more? 👀",
        l3: "Great, I'll book your exit interview. And mine 🙂",
        l4: "Before HR empties out too: vote on when I leave the group 🗳️",
      },
    },
    fed_up: {
      a: {
        l1: "Honestly? {not}. I've just had enough 💅",
        l2: "Finally, someone said it",
        l3: "DRAMA 🍿🍿",
        l4: "So grab popcorn and vote on when I leave the group 🍿🗳️",
      },
      b: {
        l1: "No, {not}. My patience just ran out 💅",
        l2: "Let's keep it respectful, people 🙏",
        l3: "Says the guy who booked a 7:30 standup",
        l4: "Respectfully: vote on when I leave. Just not 7:30 🗳️",
      },
      c: {
        l1: "Real talk? {not}. I'm done, full stop 💅",
        l2: "Louder, for the people on mute 👏",
        l3: "LOUDER: VOTE ON WHEN I LEAVE THE GROUP 📢🗳️",
        l4: "Noted. Adding it to the exit survey 📋",
      },
    },
  },
};
