import styles from "./ChatLine.module.scss";
import { classMap, NO_CLASS } from "@/shared/utils/classMap";

export const chatLineClasses = classMap("ChatLine", {
  name: styles["chat-line__name"],
  text: styles["chat-line__text"],
  sender: {
    dana: styles["chat-line__name--dana"],
    yossi: styles["chat-line__name--yossi"],
    me: NO_CLASS,
  },
});
