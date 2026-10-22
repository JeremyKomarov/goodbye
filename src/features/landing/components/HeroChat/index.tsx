"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { LeaveReason } from "@/features/landing/api/rooms.dto";
import { SystemPill } from "@/shared/components/SystemPill";
import { pad } from "@/shared/utils/countdown";
import { isolate } from "@/shared/utils/isolate";
import { heroChatClasses } from "./HeroChat.classes";
import {
  CHAT_SENDERS, CHAT_START_MINUTE, CORRECTIONS, FIRST_LINE_MS, LINE_MS, OPENERS,
  type ChatSender, type ScriptLine,
} from "./HeroChat.const";
import { HERO_CHAT_NAMESPACE, heroChatKeys } from "./HeroChat.keys.const";
import { ChatHeader } from "./partials/ChatHeader";
import { ChatLine, CHAT_LINE_MOTION } from "./partials/ChatLine";
import { ClosingCountdown } from "./partials/ClosingCountdown";
import { TypingDots } from "./partials/TypingDots";

interface Line {
  from: ChatSender;
  text: string;
}

/**
 * The landing page's group chat. It plays the opening of `story`; a new story continues the same
 * chat with a correction. The header previews the names the host is typing into the wizard.
 */
export function HeroChat({
  story,
  hostName,
  groupName,
}: {
  story: LeaveReason;
  hostName: string;
  groupName: string;
}) {
  const t = useTranslations(HERO_CHAT_NAMESPACE);
  const reduceMotion = useReducedMotion();
  const say = (script: readonly ScriptLine[], values?: { not: string }): Line[] =>
    script.map(({ from, key }) => ({ from, text: t(key, values) }));

  const [shown, setShown] = useState<Line[]>([]);
  const [queue, setQueue] = useState<Line[]>(() => say(OPENERS[story]));
  const [playing, setPlaying] = useState(story);

  // A new story continues the chat: what was not said yet is dropped, the correction queued.
  if (story !== playing) {
    setPlaying(story);
    setQueue(say(CORRECTIONS[story], { not: t(heroChatKeys.not[playing]) }));
  }

  useEffect(() => {
    if (queue.length === 0) return;
    const delay = reduceMotion ? 0 : shown.length === 0 ? FIRST_LINE_MS : LINE_MS;
    const timer = setTimeout(() => {
      const [next, ...rest] = queue;
      setShown((lines) => [...lines, next]);
      setQueue(rest);
    }, delay);
    return () => clearTimeout(timer);
  }, [queue, shown.length, reduceMotion]);

  const isTyping = !reduceMotion && queue.length > 0 && queue[0].from !== CHAT_SENDERS.me;
  const isSettled = queue.length === 0 && shown.length > 0;

  // Follow the conversation: the newest line scrolls into view as it arrives.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scroller.current;
    element?.scrollTo({ top: element.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [shown.length, isTyping, isSettled, reduceMotion]);

  const host = hostName.trim();
  const members = t(heroChatKeys.members, {
    dana: t(heroChatKeys.senders.dana),
    yossi: t(heroChatKeys.senders.yossi),
    host: host ? isolate(host) : t(heroChatKeys.me),
  });

  return (
    <div className={heroChatClasses.root}>
      <ChatHeader title={groupName.trim() || t(heroChatKeys.group)} members={members} />
      <motion.div ref={scroller} layoutScroll className={heroChatClasses.scroller}>
        <div className={heroChatClasses.lines}>
          <AnimatePresence initial={false}>
            {shown.map((line, index) => (
              <ChatLine
                key={index}
                from={line.from}
                name={line.from === CHAT_SENDERS.me ? null : t(heroChatKeys.senders[line.from])}
                text={line.text}
                time={clock(index)}
              />
            ))}
            {isSettled && (
              <motion.div key="system" {...CHAT_LINE_MOTION} className={heroChatClasses.system}>
                <SystemPill>
                  {t(heroChatKeys.system)} <ClosingCountdown />
                </SystemPill>
              </motion.div>
            )}
            {isTyping && <TypingDots key="typing" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/** The fake clock: the line at `index` was sent `index` minutes after the chat began. */
function clock(index: number) {
  const minutes = CHAT_START_MINUTE + index;
  return `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`;
}
