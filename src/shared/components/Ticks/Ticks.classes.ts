import styles from "./Ticks.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const ticksClasses = classMap("Ticks", {
  root: styles["ticks"],
  state: {
    sent: styles["ticks--sent"],
    delivered: styles["ticks--delivered"],
    read: styles["ticks--read"],
  },
});
