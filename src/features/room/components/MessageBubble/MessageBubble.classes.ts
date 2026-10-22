import styles from "./MessageBubble.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const messageBubbleClasses = classMap("MessageBubble", {
  root: styles["message-bubble"],
  mine: styles["message-bubble--mine"],
  spaced: styles["message-bubble--spaced"],
  row: styles["message-bubble__row"],
  name: styles["message-bubble__name"],
  badge: styles["message-bubble__badge"],
  body: styles["message-bubble__body"],
  react: styles["message-bubble__react"],
  picker: styles["message-bubble__picker"],
  chips: styles["message-bubble__chips"],
});
