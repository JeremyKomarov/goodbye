import styles from "./GroupMessages.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const groupMessagesClasses = classMap("GroupMessages", {
  root: styles["group-messages"],
  title: styles["group-messages__title"],
});
