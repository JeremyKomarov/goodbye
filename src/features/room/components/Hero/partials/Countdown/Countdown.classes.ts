import styles from "./Countdown.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const countdownClasses = classMap("Countdown", {
  root: styles.countdown,
  days: styles.countdown__days,
  digits: styles.countdown__digits,
  tone: {
    plain: styles["countdown__digits--plain"],
    overtime: styles["countdown__digits--overtime"],
  },
  spoken: styles.countdown__spoken,
});
