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

const { openers, corrections } = heroChatKeys;

type Leaves<T> = T extends string
  ? T
  : { [K in keyof T]: Leaves<T[K]> }[keyof T];

export interface ScriptLine {
  from: ChatSender;
  key:
    | Leaves<typeof openers>
    | Leaves<typeof corrections>;
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

/**
 * What follows when the host switches to this story — they take back the last, two react — one
 * of three at random.
 */
export const CORRECTIONS: Record<LeaveReason, readonly (readonly ScriptLine[])[]> = {
  fired: [
    [line(me, corrections.fired.a.l1), line(dana, corrections.fired.a.l2), line(yossi, corrections.fired.a.l3)],
    [line(me, corrections.fired.b.l1), line(avi, corrections.fired.b.l2), line(dana, corrections.fired.b.l3)],
    [line(me, corrections.fired.c.l1), line(noa, corrections.fired.c.l2), line(yossi, corrections.fired.c.l3)],
  ],
  quit: [
    [line(me, corrections.quit.a.l1), line(dana, corrections.quit.a.l2), line(yossi, corrections.quit.a.l3)],
    [line(me, corrections.quit.b.l1), line(avi, corrections.quit.b.l2), line(dana, corrections.quit.b.l3)],
    [line(me, corrections.quit.c.l1), line(yossi, corrections.quit.c.l2), line(noa, corrections.quit.c.l3)],
  ],
  fed_up: [
    [line(me, corrections.fed_up.a.l1), line(dana, corrections.fed_up.a.l2), line(yossi, corrections.fed_up.a.l3)],
    [line(me, corrections.fed_up.b.l1), line(avi, corrections.fed_up.b.l2), line(yossi, corrections.fed_up.b.l3)],
    [line(me, corrections.fed_up.c.l1), line(dana, corrections.fed_up.c.l2), line(noa, corrections.fed_up.c.l3)],
  ],
};

/**
 * The pacing, in ms: the first line's wait, a pause picked at random from [min, max] before each
 * line after it, and how long someone types — by the length of what they write.
 */
export const FIRST_LINE_MS = 500;
export const READ_PAUSE_MS = [300, 1200] as const;
export const TYPING_MS = { base: 500, perChar: 40, max: 3000 } as const;

/** The chat keeps the newest lines only, however many times the story is switched. */
export const MAX_LINES = 30;
