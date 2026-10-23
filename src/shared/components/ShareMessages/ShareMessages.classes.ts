import styles from "./ShareMessages.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const shareMessagesClasses = classMap("ShareMessages", {
  root: styles["share-messages"],
  card: styles["share-messages__card"],
  head: styles["share-messages__head"],
  title: styles["share-messages__title"],
  when: styles["share-messages__when"],
  text: styles["share-messages__text"],
  actions: styles["share-messages__actions"],
  send: styles["share-messages__send"],
  hint: styles["share-messages__hint"],
});
