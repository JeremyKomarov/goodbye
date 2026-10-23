import styles from "./GamesClosed.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const gamesClosedClasses = classMap("GamesClosed", {
  root: styles["games-closed"],
  title: styles["games-closed__title"],
  body: styles["games-closed__body"],
  board: styles["games-closed__board"],
});
