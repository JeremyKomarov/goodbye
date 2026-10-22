import styles from "./CreateSuccess.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const createSuccessClasses = classMap("CreateSuccess", {
  root: styles["create-success"],
  section: styles["create-success__section"],
  intro: styles["create-success__intro"],
  ballot: styles["create-success__ballot"],
  action: styles["create-success__action"],
  share: styles["create-success__action--share"],
  enter: styles["create-success__action--enter"],
});
