import styles from "./Intro.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const introClasses = classMap("Intro", {
  root: styles["intro"],
  switch: styles["intro__switch"],
  title: styles["intro__title"],
  description: styles["intro__description"],
});
