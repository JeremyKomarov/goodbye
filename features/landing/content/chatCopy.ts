import type { Locale } from "@/core/i18n/messages";
import type { Reason } from "@/core/types";

export type ChatLine =
  | { kind: "in"; name: string; color: string; text: string }
  | { kind: "out"; text: string };

const chat = {
  he: {
    dana: "דנה",
    yossi: "יוסי מהכספים",
    group: "צוות מוצר",
    me: "את/ה",
    members: "ועוד 37",
    system: "הקבוצה הצביעה. יוצאים בעוד",
    not: { fired: "לא פוטרתי", quit: "לא התפטרתי", fed_up: "זה לא סתם נמאס לי" },
    openers: {
      fired: ["שמעתי מה קרה 😢 מחבקת", "אז אתה נשאר בקבוצה או...?", "אין לי מושג מתי לצאת בלי שזה יהיה מביך 🫠"],
      quit: ["היי חברה, אז... אני עזבתי 🫡", "מה?? באמת?! 😱 מזל טוב!!", "ומי עכשיו יביא בורקס בחמישי?", "רגע, נשאר רק להחליט מתי לצאת מהקבוצה 😏"],
      fed_up: ["מי לקח לי את היוגורט מהמקרר??", "תזכורת: דיילי מחר ב-8:00 🙃", "זהו. נמאס לי. הגיע הזמן לצאת מהקבוצה הזאת 💅", "רגע רגע, לפחות שנצביע מתי 🍿"],
    },
    corrections: {
      fired: ["לא לא, {not}. האמת? פוטרתי 🙃", "אוי לא 😢 מחבקת חזק", "רגע, אז מה נכון בכלל??"],
      quit: ["רגע, {not}. אני התפטרתי! 🫡", "מההה?? מזל טוב!! 🥳", "אוקיי אני כבר לא מבין כלום 😵‍💫"],
      fed_up: ["האמת? {not}. פשוט נמאס לי 💅", "דרמה! 🍿🍿", "סוף סוף מישהו אמר את זה"],
    },
  },
  en: {
    dana: "Dana",
    yossi: "Yossi from finance",
    group: "Product team",
    me: "you",
    members: "and 37 others",
    system: "The group voted. Leaving in",
    not: { fired: "I wasn't fired", quit: "I didn't resign", fed_up: "I'm not just fed up" },
    openers: {
      fired: ["I heard what happened 😢 Sending a hug", "So are you staying in the group or...?", "I have no idea when to leave without making it awkward 🫠"],
      quit: ["Hey everyone, so... I resigned 🫡", "What?! Really?! 😱 Congrats!", "Who's bringing pastries on Thursday now?", "Now we just need to decide when I leave the group 😏"],
      fed_up: ["Who took my yogurt from the fridge??", "Reminder: standup tomorrow at 8:00 🙃", "That's it. I've had enough. Time to leave this group 💅", "Wait, at least let us vote on when 🍿"],
    },
    corrections: {
      fired: ["No, {not}. The truth is, I was fired 🙃", "Oh no 😢 Sending a big hug", "Wait, so what's actually true??"],
      quit: ["Hold on, {not}. I resigned! 🫡", "Whaaat?? Congrats!! 🥳", "Okay, I'm completely confused now 😵‍💫"],
      fed_up: ["Actually, {not}. I've just had enough 💅", "Drama! 🍿🍿", "Finally, someone said it"],
    },
  },
} satisfies Record<Locale, {
  dana: string; yossi: string; group: string; me: string; members: string; system: string;
  not: Record<Reason, string>;
  openers: Record<Reason, string[]>;
  corrections: Record<Reason, string[]>;
}>;

const incoming = (name: string, color: string, text: string): ChatLine => ({ kind: "in", name, color, text });
const outgoing = (text: string): ChatLine => ({ kind: "out", text });

export function chatCopy(locale: Locale) {
  const copy = chat[locale];
  const dana = (text: string) => incoming(copy.dana, "#e26ab6", text);
  const yossi = (text: string) => incoming(copy.yossi, "#53bdeb", text);
  const lines = (reason: Reason, values: string[]) => reason === "fired"
    ? [dana(values[0]), yossi(values[1]), outgoing(values[2])]
    : reason === "quit"
      ? [outgoing(values[0]), dana(values[1]), yossi(values[2]), outgoing(values[3])]
      : [yossi(values[0]), dana(values[1]), outgoing(values[2]), dana(values[3])];
  return {
    group: copy.group,
    me: copy.me,
    members: copy.members,
    dana: copy.dana,
    yossi: copy.yossi,
    system: copy.system,
    openers: (reason: Reason) => lines(reason, copy.openers[reason]),
    correction: (from: Reason, to: Reason) => {
      const values = copy.corrections[to].map((value) => value.replace("{not}", copy.not[from]));
      return [outgoing(values[0]), dana(values[1]), yossi(values[2])];
    },
  };
}
