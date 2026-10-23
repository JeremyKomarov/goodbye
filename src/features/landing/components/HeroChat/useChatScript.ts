import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { LeaveReason } from "@/features/landing/api/rooms.dto";
import { pad } from "@/shared/utils/countdown";
import {
  CHAT_SENDERS,
  CHATTER,
  CHATTER_GAP_MS,
  CORRECTIONS,
  FIRST_LINE_MS,
  MAX_LINES,
  OPENERS,
  REACTION_CHANCE,
  REACTION_REACH,
  REACTIONS,
  READ_PAUSE_MS,
  TYPING_MS,
  type Colleague,
  type ScriptLine,
} from "./HeroChat.const";
import { HERO_CHAT_NAMESPACE, heroChatKeys } from "./HeroChat.keys.const";

/** A line already in the chat. `not` is the story a correction takes back. */
export interface ShownLine extends ScriptLine {
  id: number;
  not: LeaveReason | null;
  time: string;
  reactions: Record<string, number>;
}

/**
 * Plays the group chat for `story`, the way a real one arrives: a pause, someone typing for as long
 * as their line takes, the line, now and then a reaction. The first story opens with one of its
 * openings at random; a new story plays its correction; after either the group keeps chatting
 * about the story told, a random beat at a time, for as long as the page is open.
 */
export function useChatScript(story: LeaveReason) {
  const t = useTranslations(HERO_CHAT_NAMESPACE);
  const still = useReducedMotion();
  const [lines, setLines] = useState<ShownLine[]>([]);
  const [typing, setTyping] = useState<Colleague | null>(null);
  // The id of the line the "group voted" notice follows: the end of the first story told.
  const [noticeAfter, setNoticeAfter] = useState<number | null>(null);
  // The story the chat last said a line of — set on saying it, so an effect undone before its
  // first line (a fast switch, or strict mode) starts over rather than correcting nothing.
  const told = useRef<LeaveReason | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const before = told.current;
    const script =
      before === null
        ? pickOne(OPENERS[story])
        : before === story
          ? []
          : CORRECTIONS[story];
    const not = before === null || before === story ? null : before;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let isFirst = before === null;

    const wait = (ms: number, then: () => void) => {
      timer = setTimeout(then, still ? 0 : ms);
    };

    const say = (line: ScriptLine) => {
      told.current = story;
      setTyping(null);
      const shown: ShownLine = {
        ...line,
        id: nextId.current++,
        not,
        time: clockNow(),
        reactions: {},
      };
      setLines((all) => [...all, shown].slice(-MAX_LINES));
    };

    const play = (queue: readonly ScriptLine[], then: () => void) => {
      const [line, ...rest] = queue;
      if (!line) return then();
      const text = t(line.key, {
        not: not ? t(heroChatKeys.not[not]) : "",
        gender: "m",
      });
      const typed = Math.min(
        TYPING_MS.base + text.length * TYPING_MS.perChar,
        TYPING_MS.max,
      );
      const pause = isFirst ? FIRST_LINE_MS : between(READ_PAUSE_MS);
      isFirst = false;
      wait(pause, () => {
        const next = () => {
          say(line);
          play(rest, then);
        };
        // The host's own lines arrive without anyone seen typing.
        if (line.from === CHAT_SENDERS.me) return wait(typed / 2, next);
        setTyping(line.from);
        wait(typed, next);
      });
    };

    const react = () => {
      const emoji = pickOne(REACTIONS[story]);
      setLines((all) => {
        if (all.length === 0) return all;
        const at =
          all.length -
          1 -
          Math.floor(Math.random() * Math.min(REACTION_REACH, all.length));
        const target = all[at];
        const reactions = {
          ...target.reactions,
          [emoji]: (target.reactions[emoji] ?? 0) + 1,
        };
        return all.with(at, { ...target, reactions });
      });
    };

    let bag: (readonly ScriptLine[])[] = [];
    const nextBeat = () => {
      if (bag.length === 0) bag = shuffle(CHATTER[story]);
      return bag.pop()!;
    };
    const chat = () =>
      wait(between(CHATTER_GAP_MS), () => {
        if (Math.random() < REACTION_CHANCE) react();
        play(nextBeat(), chat);
      });

    play(script, () => {
      setNoticeAfter((after) => after ?? nextId.current - 1);
      // Reduced motion: the story, told at once, and then a quiet chat.
      if (!still) chat();
    });

    return () => {
      clearTimeout(timer);
      setTyping(null);
    };
  }, [story, still, t]);

  return { lines, typing, noticeAfter };
}

function between([min, max]: readonly [number, number]) {
  return min + Math.random() * (max - min);
}

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The time a line arrives, as the chat shows it. */
function clockNow() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
