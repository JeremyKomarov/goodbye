import styles from "./Bubble.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const bubbleClasses = classMap("Bubble", {
  root: styles["bubble"],
  meta: styles["bubble__meta"],
  tail: styles["bubble--tail"],
  side: {
    in: styles["bubble--in"],
    out: styles["bubble--out"],
  },
});
