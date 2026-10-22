import styles from "./SystemPill.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const systemPillClasses = classMap("SystemPill", {
  root: styles["system-pill"],
  tone: {
    default: styles["system-pill--default"],
    highlight: styles["system-pill--highlight"],
  },
});
