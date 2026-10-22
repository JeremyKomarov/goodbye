import styles from "./HourGrid.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const hourGridClasses = classMap("HourGrid", {
  root: styles["hour-grid"],
  dense: styles["hour-grid--dense"],
  chip: styles["hour-grid__chip"],
  past: styles["hour-grid__chip--past"],
  empty: styles["hour-grid__chip--empty"],
  darkText: styles["hour-grid__chip--dark-text"],
  mine: styles["hour-grid__chip--mine"],
  winner: styles["hour-grid__chip--winner"],
  idle: styles["hour-grid__chip--idle"],
  step: {
    0: styles["hour-grid__chip--step-0"],
    1: styles["hour-grid__chip--step-1"],
    2: styles["hour-grid__chip--step-2"],
    3: styles["hour-grid__chip--step-3"],
    4: styles["hour-grid__chip--step-4"],
  },
  hour: styles["hour-grid__hour"],
  votes: styles["hour-grid__votes"],
  ticks: styles["hour-grid__ticks"],
  flag: styles["hour-grid__flag"],
});
