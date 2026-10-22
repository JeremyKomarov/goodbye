import styles from "./ExitRow.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const exitRowClasses = classMap("ExitRow", {
  root: styles["exit-row"],
  fill: styles["exit-row__fill"],
  body: styles["exit-row__body"],
  label: styles["exit-row__label"],
  end: styles["exit-row__end"],
});
