import styles from "./ExitRow.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const exitRowClasses = classMap("ExitRow", {
  root: styles["exit-row"],
  action: styles["exit-row--action"],
  urgent: styles["exit-row--urgent"],
  button: styles["exit-row__button"],
  fill: styles["exit-row__fill"],
  body: styles["exit-row__body"],
  label: styles["exit-row__label"],
  end: styles["exit-row__end"],
});
