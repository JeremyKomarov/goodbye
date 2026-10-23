import styles from "./Finale.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const finaleClasses = classMap("Finale", {
  root: styles["finale"],
  column: styles["finale__column"],
  notice: styles["finale__notice"],
  headline: styles["finale__headline"],
  body: styles["finale__body"],
  stats: styles["finale__stats"],
  stat: styles["finale__stat"],
  label: styles["finale__label"],
  value: styles["finale__value"],
  loved: styles["finale__loved"],
  quote: styles["finale__quote"],
  author: styles["finale__author"],
  champions: styles["finale__champions"],
  championsTitle: styles["finale__champions-title"],
  list: styles["finale__list"],
  champion: styles["finale__champion"],
  game: styles["finale__game"],
  holder: styles["finale__holder"],
});
