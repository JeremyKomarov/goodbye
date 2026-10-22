import styles from "./DayStrip.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const dayStripClasses = classMap("DayStrip", {
  root: styles["day-strip"],
  day: styles["day-strip__day"],
  selected: styles["day-strip__day--selected"],
  winner: styles["day-strip__day--winner"],
  name: styles["day-strip__name"],
  date: styles["day-strip__date"],
  ticks: styles["day-strip__ticks"],
  count: styles["day-strip__count"],
});
