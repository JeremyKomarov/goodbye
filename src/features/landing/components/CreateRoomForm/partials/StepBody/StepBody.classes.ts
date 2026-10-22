import styles from "./StepBody.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const stepBodyClasses = classMap("StepBody", {
  root: styles["step-body"],
  legend: styles["step-body__legend"],
  title: styles["step-body__title"],
  sub: styles["step-body__sub"],
});
