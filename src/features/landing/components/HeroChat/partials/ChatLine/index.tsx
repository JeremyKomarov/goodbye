import { motion } from "motion/react";
import type { ChatSender } from "@/features/landing/components/HeroChat/HeroChat.const";
import { Bubble, BUBBLE_SIDES } from "@/shared/components/Bubble";
import { Ticks } from "@/shared/components/Ticks";
import { cn } from "@/shared/utils/cn";
import { chatLineClasses } from "./ChatLine.classes";
import { CHAT_LINE_MOTION } from "./ChatLine.const";

/** One line of the chat. A colleague's carries their name; the host's is outgoing, with ticks. */
export function ChatLine({
  from,
  name,
  text,
  time,
}: {
  from: ChatSender;
  name: string | null;
  text: string;
  time: string;
}) {
  const meta = (
    <>
      <span dir="ltr">{time}</span>
      {name === null && <Ticks />}
    </>
  );

  return (
    <motion.div {...CHAT_LINE_MOTION}>
      <Bubble side={name === null ? BUBBLE_SIDES.out : BUBBLE_SIDES.in} meta={meta}>
        {name !== null && (
          <div className={cn(chatLineClasses.name, chatLineClasses.sender[from])}>{name}</div>
        )}
        <div className={chatLineClasses.text}>{text}</div>
      </Bubble>
    </motion.div>
  );
}

export { CHAT_LINE_MOTION };
