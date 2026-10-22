import styles from "./HeroChat.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const heroChatClasses = classMap("HeroChat", {
  root: styles["hero-chat"],
  scroller: styles["hero-chat__scroller"],
  lines: styles["hero-chat__lines"],
  system: styles["hero-chat__system"],
});
