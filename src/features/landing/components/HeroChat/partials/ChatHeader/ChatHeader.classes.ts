import styles from "./ChatHeader.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const chatHeaderClasses = classMap("ChatHeader", {
  root: styles["chat-header"],
  avatar: styles["chat-header__avatar"],
  text: styles["chat-header__text"],
  title: styles["chat-header__title"],
  members: styles["chat-header__members"],
});
