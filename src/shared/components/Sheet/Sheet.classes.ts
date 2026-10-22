import styles from "./Sheet.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const sheetClasses = classMap("Sheet", {
  root: styles["sheet"],
  backdrop: styles["sheet__backdrop"],
  panel: styles["sheet__panel"],
  header: styles["sheet__header"],
  title: styles["sheet__title"],
  body: styles["sheet__body"],
});
