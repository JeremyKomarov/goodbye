import styles from "./ComingSoon.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const comingSoonClasses = classMap("ComingSoon", {
  root: styles["coming-soon"],
  pill: styles["coming-soon__pill"],
  title: styles["coming-soon__title"],
  body: styles["coming-soon__body"],
  note: styles["coming-soon__note"],
});
