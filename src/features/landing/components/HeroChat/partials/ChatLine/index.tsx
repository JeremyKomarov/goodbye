import { motion } from "motion/react";
import {
  CHAT_SENDERS, type ChatSender,
} from "@/features/landing/components/HeroChat/HeroChat.const";
import { Bubble, BUBBLE_SIDES } from "@/shared/components/Bubble";
import { Ticks } from "@/shared/components/Ticks";
import { cn } from "@/shared/utils/cn";
import { chatLineClasses } from "./ChatLine.classes";
import { CHAT_LINE_MOTION } from "./ChatLine.const";

/**
 * One line of the chat. A colleague's carries their name; the host's is outgoing, with ticks. A
 * follow-up in a run from one sender has no tail.
 */
export function ChatLine({
  from,
  name,
  isFollowUp,
  text,
  time,
}: {
  from: ChatSender;
  name: string | null;
  isFollowUp: boolean;
  text: string;
  time: string;
}) {
  const isMine = from === CHAT_SENDERS.me;
  const meta = (
    <>
      <span dir="ltr">{time}</span>
      {isMine && <Ticks />}
    </>
  );

  return (
    <motion.div {...CHAT_LINE_MOTION}>
      <Bubble side={isMine ? BUBBLE_SIDES.out : BUBBLE_SIDES.in} hasTail={!isFollowUp} meta={meta}>
        {name !== null && (
          <div className={cn(chatLineClasses.name, chatLineClasses.sender[from])}>{name}</div>
        )}
        <div className={chatLineClasses.text}>{text}</div>
      </Bubble>
    </motion.div>
  );
}

export { CHAT_LINE_MOTION };
