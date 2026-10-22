import styles from "./Hero.module.scss";
import { classMap } from "@/shared/utils/classMap";

// Shared by the three states' partials, so the card keeps one rhythm whatever the room is doing.
export const heroClasses = classMap("Hero", {
  root: styles.hero,
  exited: styles["hero--exited"],
  pill: styles.hero__pill,
  label: styles.hero__label,
  note: styles.hero__note,
  tie: styles.hero__tie,
  tied: styles.hero__tied,
  verdict: styles.hero__verdict,
});
