import { AnimatePresence, motion } from "motion/react";
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
 * follow-up in a run from one sender has no tail. Reactions pop in under it as they arrive.
 * Decorative, like the whole chat: the reactions are not buttons.
 */
export function ChatLine({
  from,
  name,
  isFollowUp,
  text,
  time,
  reactions,
}: {
  from: ChatSender;
  name: string | null;
  isFollowUp: boolean;
  text: string;
  time: string;
  reactions: Record<string, number>;
}) {
  const isMine = from === CHAT_SENDERS.me;
  const counts = Object.entries(reactions);
  const meta = (
    <>
      <span dir="ltr">{time}</span>
      {isMine && <Ticks />}
    </>
  );

  return (
    <motion.div {...CHAT_LINE_MOTION} className={cn(chatLineClasses.root, isMine && chatLineClasses.mine)}>
      <Bubble side={isMine ? BUBBLE_SIDES.out : BUBBLE_SIDES.in} hasTail={!isFollowUp} meta={meta}>
        {name !== null && (
          <div className={cn(chatLineClasses.name, chatLineClasses.sender[from])}>{name}</div>
        )}
        <div className={chatLineClasses.text}>{text}</div>
      </Bubble>
      <AnimatePresence>
        {counts.length > 0 && (
          <motion.div
            className={chatLineClasses.reactions}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 14, stiffness: 400 }}
          >
            {counts.map(([emoji, count]) => (
              <motion.span
                key={`${emoji}${count}`}
                className={chatLineClasses.reaction}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
              >
                {emoji}
                {count > 1 && count}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { CHAT_LINE_MOTION };
