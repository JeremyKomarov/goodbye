import styles from "./StatusStories.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const statusStoriesClasses = classMap("StatusStories", {
  root: styles["status-stories"],
  item: styles["status-stories__item"],
  title: styles["status-stories__title"],
  seen: styles["status-stories__title--seen"],
});
