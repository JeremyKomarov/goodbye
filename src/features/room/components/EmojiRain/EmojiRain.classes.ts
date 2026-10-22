import styles from "./EmojiRain.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const emojiRainClasses = classMap("EmojiRain", {
  root: styles["emoji-rain"],
  drop: styles["emoji-rain__drop"],
});
