import styles from "./FlipDigits.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const flipDigitsClasses = classMap("FlipDigits", {
  root: styles["flip-digits"],
  colon: styles["flip-digits__colon"],
  slot: styles["flip-digits__slot"],
  digit: styles["flip-digits__digit"],
});
