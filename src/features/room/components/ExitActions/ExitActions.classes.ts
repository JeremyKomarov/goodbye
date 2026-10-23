import styles from "./ExitActions.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const exitActionsClasses = classMap("ExitActions", {
  root: styles["exit-actions"],
  note: styles["exit-actions__note"],
  links: styles["exit-actions__links"],
  link: styles["exit-actions__link"],
});
