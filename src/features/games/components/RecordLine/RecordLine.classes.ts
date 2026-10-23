import styles from "./RecordLine.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const recordLineClasses = classMap("RecordLine", {
  root: styles["record-line"],
  line: styles["record-line__line"],
  label: styles["record-line__label"],
  name: styles["record-line__name"],
  score: styles["record-line__score"],
});
