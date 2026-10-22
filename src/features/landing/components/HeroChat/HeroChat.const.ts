import type { LeaveReason } from "@/features/landing/api/rooms.dto";
import { heroChatKeys } from "./HeroChat.keys.const";

/** Who says a line: two colleagues, or the host — whose lines are the outgoing bubbles. */
export const CHAT_SENDERS = { dana: "dana", yossi: "yossi", me: "me" } as const;

export type ChatSender = (typeof CHAT_SENDERS)[keyof typeof CHAT_SENDERS];

const openers = heroChatKeys.openers;
const corrections = heroChatKeys.corrections;

type Leaves<T> = T extends string ? T : { [K in keyof T]: Leaves<T[K]> }[keyof T];

export interface ScriptLine {
  from: ChatSender;
  key: Leaves<typeof openers> | Leaves<typeof corrections>;
}

const { dana, yossi, me } = CHAT_SENDERS;

/** How each story opens. */
export const OPENERS: Record<LeaveReason, readonly ScriptLine[]> = {
  fired: [
    { from: dana, key: openers.fired.l1 },
    { from: yossi, key: openers.fired.l2 },
    { from: me, key: openers.fired.l3 },
  ],
  quit: [
    { from: me, key: openers.quit.l1 },
    { from: dana, key: openers.quit.l2 },
    { from: yossi, key: openers.quit.l3 },
    { from: me, key: openers.quit.l4 },
  ],
  fed_up: [
    { from: yossi, key: openers.fed_up.l1 },
    { from: dana, key: openers.fed_up.l2 },
    { from: me, key: openers.fed_up.l3 },
    { from: dana, key: openers.fed_up.l4 },
  ],
};

/** What follows when the host switches to this story: they take back the last, two react. */
export const CORRECTIONS: Record<LeaveReason, readonly ScriptLine[]> = {
  fired: [
    { from: me, key: corrections.fired.l1 },
    { from: dana, key: corrections.fired.l2 },
    { from: yossi, key: corrections.fired.l3 },
  ],
  quit: [
    { from: me, key: corrections.quit.l1 },
    { from: dana, key: corrections.quit.l2 },
    { from: yossi, key: corrections.quit.l3 },
  ],
  fed_up: [
    { from: me, key: corrections.fed_up.l1 },
    { from: dana, key: corrections.fed_up.l2 },
    { from: yossi, key: corrections.fed_up.l3 },
  ],
};

/** The first line waits a beat; each after it shows "typing" for this long first. */
export const FIRST_LINE_MS = 500;
export const LINE_MS = 1100;

/** The fake clock: the chat starts at 16:02, one minute per line. */
export const CHAT_START_MINUTE = 16 * 60 + 2;
