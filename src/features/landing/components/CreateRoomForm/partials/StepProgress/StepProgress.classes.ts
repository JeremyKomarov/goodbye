import styles from "./StepProgress.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const stepProgressClasses = classMap("StepProgress", {
  root: styles["step-progress"],
  bars: styles["step-progress__bars"],
  bar: styles["step-progress__bar"],
  fill: styles["step-progress__fill"],
  count: styles["step-progress__count"],
});
