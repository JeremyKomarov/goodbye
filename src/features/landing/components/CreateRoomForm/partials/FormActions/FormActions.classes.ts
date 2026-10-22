import styles from "./FormActions.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const formActionsClasses = classMap("FormActions", {
  root: styles["form-actions"],
});
