import styles from "./Board.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const boardClasses = classMap("Board", {
  root: styles["board"],
  card: styles["board__card"],
  title: styles["board__title"],
  empty: styles["board__empty"],
  play: styles["board__play"],
  hours: styles["board__hours"],
  hour: styles["board__hour"],
  track: styles["board__track"],
  bar: styles["board__bar"],
  rows: styles["board__rows"],
  row: styles["board__row"],
  mine: styles["board__row--mine"],
  rank: styles["board__rank"],
  first: styles["board__rank--first"],
  avatar: styles["board__avatar"],
  name: styles["board__name"],
  you: styles["board__you"],
  score: styles["board__score"],
});
