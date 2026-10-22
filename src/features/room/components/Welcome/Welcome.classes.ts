import styles from "./Welcome.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const welcomeClasses = classMap("Welcome", {
  root: styles.welcome,
  avatar: styles.welcome__avatar,
  text: styles.welcome__text,
});
