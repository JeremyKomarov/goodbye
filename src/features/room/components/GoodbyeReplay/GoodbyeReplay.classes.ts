import styles from "./GoodbyeReplay.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const goodbyeReplayClasses = classMap("GoodbyeReplay", {
  root: styles["goodbye-replay"],
  name: styles["goodbye-replay__name"],
  body: styles["goodbye-replay__body"],
  short: styles["goodbye-replay__body--short"],
  reactions: styles["goodbye-replay__reactions"],
});
