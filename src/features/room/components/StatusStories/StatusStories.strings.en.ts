import type { StringsOf } from "@/core/i18n/strings.types";
import type { statusStoriesStrings } from "./StatusStories.strings";

export const statusStoriesStringsEn: StringsOf<typeof statusStoriesStrings> = {
  label: "Fun facts",
  didYouKnow: "Did you know?",
  all: "All the facts",
  close: "Close",
  previous: "Previous fact",
  next: "Next fact",
  hint: "Hold to pause. Tap the right side to go on.",
  groups: {
    whatsapp: {
      title: "WhatsApp",
      facts: {
        f1:
          "WhatsApp was founded in 2009 by Jan Koum and Brian Acton, both former Yahoo " +
          "employees.",
        f2: "The name WhatsApp is a play on the greeting \"What's up\".",
        f3:
          "At first WhatsApp wasn't meant for chatting at all. The idea was to show a short " +
          "status next to your name in people's contacts.",
        f4: "In 2014 Facebook bought WhatsApp for about $19 billion.",
        f5:
          "Jan Koum signed the deal with Facebook on the door of the welfare office where he " +
          "once queued for food stamps.",
        f6: "Until 2016 WhatsApp cost a dollar a year, after a free first year.",
        f7:
          "The blue double tick, which shows your message was read, only arrived in 2014. " +
          "No excuses since.",
        f8: "In 2016 every message on WhatsApp became end-to-end encrypted.",
        f9:
          "In October 2021 WhatsApp, Facebook and Instagram went down together for about six " +
          "hours. Some people found out there's a world outside.",
      },
    },
    fired: {
      title: "Fired, then famous",
      facts: {
        f1:
          "Steve Jobs was pushed out of Apple, the company he founded, in 1985. He came back " +
          "in 1997 and made it one of the biggest companies in the world.",
        f2:
          "In 2009 Brian Acton was turned down for jobs at Facebook and Twitter. Five years " +
          "later Facebook paid billions for his company.",
        f3:
          "Michael Bloomberg was let go by the investment bank Salomon Brothers in 1981, and " +
          "founded Bloomberg with the $10 million he got on the way out.",
        f4:
          "Sam Altman was fired from OpenAI in November 2023 and was back about five days " +
          "later.",
        f5:
          "Oprah Winfrey was taken off the evening news in Baltimore in 1977. She was given a " +
          "talk show, and the rest is history.",
        f6:
          "Anna Wintour has said she was fired from Harper's Bazaar after just nine months. " +
          "Today she's the most feared woman in fashion.",
      },
    },
    groups: {
      title: "Group life",
      facts: {
        f1:
          "A WhatsApp group can hold up to 1,024 people. Dunbar's number says the brain can " +
          "keep up only about 150 stable relationships.",
        f2:
          "In 2018 it was reported that India sends so many \"good morning\" pictures that " +
          "Google added a tool to its app that clears them off your phone.",
        f3:
          "You can delete most messages \"for everyone\" for about two and a half days after " +
          "sending them. It used to be just seven minutes.",
        f4:
          "You can edit a message for 15 minutes after sending it. After that, your typo is " +
          "forever.",
        f5: "Since 2020 you can mute a group \"always\". Some groups are why that button exists.",
        f6: "Polls came to WhatsApp in 2022. You're using an upgraded one right here.",
        f7: "By Unicode's 2021 figures, the world's most used emoji is 😂, followed by ❤️.",
      },
    },
  },
};
