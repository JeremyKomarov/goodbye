import { motion } from "motion/react";
import { Bubble, BUBBLE_SIDES } from "@/shared/components/Bubble";
import { CHAT_LINE_MOTION } from "@/features/landing/components/HeroChat/partials/ChatLine/ChatLine.const";
import { typingDotsClasses } from "./TypingDots.classes";

const DOTS = [0, 1, 2];

/** "Someone is typing…" — three bouncing dots in an incoming bubble. Decorative. */
export function TypingDots() {
  return (
    <motion.div {...CHAT_LINE_MOTION} aria-hidden>
      <Bubble side={BUBBLE_SIDES.in}>
        <div className={typingDotsClasses.dots}>
          {DOTS.map((dot) => (
            <motion.span
              key={dot}
              className={typingDotsClasses.dot}
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }}
            />
          ))}
        </div>
      </Bubble>
    </motion.div>
  );
}
