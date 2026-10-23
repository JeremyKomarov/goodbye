import type { HostGender, LeaveReason } from "@/features/landing/api/rooms.dto";
import { HOST_GENDERS } from "@/features/landing/api/rooms.dto";
import { heroChatKeys } from "./HeroChat.keys.const";

/** Who says a line: four colleagues, or the host — whose lines are the outgoing bubbles. */
export const CHAT_SENDERS = {
  dana: "dana",
  yossi: "yossi",
  noa: "noa",
  avi: "avi",
  me: "me",
} as const;

export type ChatSender = (typeof CHAT_SENDERS)[keyof typeof CHAT_SENDERS];
export type Colleague = Exclude<ChatSender, "me">;

/** For "… is typing" in Hebrew. */
export const SENDER_GENDERS: Record<Colleague, HostGender> = {
  dana: HOST_GENDERS.f,
  yossi: HOST_GENDERS.m,
  noa: HOST_GENDERS.f,
  avi: HOST_GENDERS.m,
};

const { openers, corrections, chatter } = heroChatKeys;

type Leaves<T> = T extends string
  ? T
  : { [K in keyof T]: Leaves<T[K]> }[keyof T];

export interface ScriptLine {
  from: ChatSender;
  key:
    | Leaves<typeof openers>
    | Leaves<typeof corrections>
    | Leaves<typeof chatter>;
}

const { dana, yossi, noa, avi, me } = CHAT_SENDERS;
const line = (from: ChatSender, key: ScriptLine["key"]): ScriptLine => ({
  from,
  key,
});

/** How each story can open; one is picked at random each time the page is opened. */
export const OPENERS: Record<LeaveReason, readonly (readonly ScriptLine[])[]> =
  {
    fired: [
      [
        line(dana, openers.fired.a.l1),
        line(yossi, openers.fired.a.l2),
        line(me, openers.fired.a.l3),
      ],
      [
        line(avi, openers.fired.b.l1),
        line(dana, openers.fired.b.l2),
        line(me, openers.fired.b.l3),
        line(yossi, openers.fired.b.l4),
      ],
      [
        line(noa, openers.fired.c.l1),
        line(me, openers.fired.c.l2),
        line(noa, openers.fired.c.l3),
        line(dana, openers.fired.c.l4),
      ],
    ],
    quit: [
      [
        line(me, openers.quit.a.l1),
        line(dana, openers.quit.a.l2),
        line(yossi, openers.quit.a.l3),
        line(me, openers.quit.a.l4),
      ],
      [
        line(me, openers.quit.b.l1),
        line(avi, openers.quit.b.l2),
        line(dana, openers.quit.b.l3),
        line(yossi, openers.quit.b.l4),
      ],
      [
        line(dana, openers.quit.c.l1),
        line(yossi, openers.quit.c.l2),
        line(me, openers.quit.c.l3),
        line(noa, openers.quit.c.l4),
      ],
    ],
    fed_up: [
      [
        line(yossi, openers.fed_up.a.l1),
        line(dana, openers.fed_up.a.l2),
        line(me, openers.fed_up.a.l3),
        line(dana, openers.fed_up.a.l4),
      ],
      [
        line(avi, openers.fed_up.b.l1),
        line(yossi, openers.fed_up.b.l2),
        line(avi, openers.fed_up.b.l3),
        line(me, openers.fed_up.b.l4),
        line(dana, openers.fed_up.b.l5),
      ],
      [
        line(noa, openers.fed_up.c.l1),
        line(me, openers.fed_up.c.l2),
        line(yossi, openers.fed_up.c.l3),
        line(dana, openers.fed_up.c.l4),
      ],
    ],
  };

/** What follows when the host switches to this story: they take back the last, two react. */
export const CORRECTIONS: Record<LeaveReason, readonly ScriptLine[]> = {
  fired: [
    line(me, corrections.fired.l1),
    line(dana, corrections.fired.l2),
    line(yossi, corrections.fired.l3),
  ],
  quit: [
    line(me, corrections.quit.l1),
    line(dana, corrections.quit.l2),
    line(yossi, corrections.quit.l3),
  ],
  fed_up: [
    line(me, corrections.fed_up.l1),
    line(dana, corrections.fed_up.l2),
    line(yossi, corrections.fed_up.l3),
  ],
};

/**
 * Once the story is told the group keeps talking, a beat at a time in a random order. A beat is
 * one line, or a line and the answer it gets.
 */
export const CHATTER: Record<LeaveReason, readonly (readonly ScriptLine[])[]> =
  {
    fired: [
      [line(dana, chatter.fired.c1)],
      [line(yossi, chatter.fired.c2)],
      [line(avi, chatter.fired.c3), line(yossi, chatter.fired.c4)],
      [line(dana, chatter.fired.c5), line(me, chatter.fired.c6)],
      [line(noa, chatter.fired.c7), line(dana, chatter.fired.c8)],
      [line(yossi, chatter.fired.c9)],
      [line(me, chatter.fired.c10)],
    ],
    quit: [
      [line(dana, chatter.quit.c1)],
      [line(yossi, chatter.quit.c2)],
      [line(avi, chatter.quit.c3)],
      [line(noa, chatter.quit.c4)],
      [line(dana, chatter.quit.c5)],
      [line(me, chatter.quit.c6), line(yossi, chatter.quit.c7)],
      [line(avi, chatter.quit.c8)],
      [line(dana, chatter.quit.c9)],
      [line(yossi, chatter.quit.c10)],
    ],
    fed_up: [
      [line(yossi, chatter.fed_up.c1)],
      [line(dana, chatter.fed_up.c2)],
      [line(avi, chatter.fed_up.c3), line(me, chatter.fed_up.c4)],
      [line(noa, chatter.fed_up.c5), line(yossi, chatter.fed_up.c6)],
      [line(dana, chatter.fed_up.c7)],
      [line(avi, chatter.fed_up.c8), line(me, chatter.fed_up.c9)],
      [line(yossi, chatter.fed_up.c10)],
    ],
  };

/** The emoji the group reacts with, per story. */
export const REACTIONS: Record<LeaveReason, readonly string[]> = {
  fired: ["😢", "❤️", "🫂", "💪"],
  quit: ["🥂", "🫡", "👏", "🔥"],
  fed_up: ["😂", "🍿", "💅", "💀"],
};

/**
 * The pacing, in ms, each a [min, max] picked at random: a pause before someone starts typing,
 * how long they type (by the length of what they write), and the quiet between beats.
 */
export const FIRST_LINE_MS = 500;
export const READ_PAUSE_MS = [300, 1200] as const;
export const TYPING_MS = { base: 500, perChar: 40, max: 3000 } as const;
export const CHATTER_GAP_MS = [2000, 5000] as const;

/** How likely a reaction lands on a recent line between beats, and how far back it looks. */
export const REACTION_CHANCE = 0.4;
export const REACTION_REACH = 4;

/** The chat keeps the newest lines only, so it can talk all day. */
export const MAX_LINES = 40;
