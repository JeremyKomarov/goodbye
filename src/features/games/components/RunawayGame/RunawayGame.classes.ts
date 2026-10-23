import styles from "./RunawayGame.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const runawayGameClasses = classMap("RunawayGame", {
  root: styles["runaway-game"],
  bar: styles["runaway-game__bar"],
  note: styles["runaway-game__note"],
  clock: styles["runaway-game__clock"],
  arena: styles["runaway-game__arena"],
  intro: styles["runaway-game__intro"],
  lead: styles["runaway-game__lead"],
  exit: styles["runaway-game__exit"],
});
