import styles from "./Intro.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const introClasses = classMap("Intro", {
  root: styles["intro"],
  title: styles["intro__title"],
  description: styles["intro__description"],
});
