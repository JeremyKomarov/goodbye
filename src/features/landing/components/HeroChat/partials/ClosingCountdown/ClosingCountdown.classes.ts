import styles from "./ClosingCountdown.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const closingCountdownClasses = classMap("ClosingCountdown", {
  root: styles["closing-countdown"],
});
