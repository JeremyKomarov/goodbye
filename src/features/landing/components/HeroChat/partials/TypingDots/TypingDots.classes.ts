import styles from "./TypingDots.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const typingDotsClasses = classMap("TypingDots", {
  dots: styles["typing-dots"],
  dot: styles["typing-dots__dot"],
});
