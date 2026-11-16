import styles from "./FormActions.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const formActionsClasses = classMap("FormActions", {
  root: styles["form-actions"],
  slots: styles["form-actions__slots"],
  noSlots: styles["form-actions__slots--none"],
  slotsAhead: styles["form-actions__slots--ahead"],
  buttons: styles["form-actions__buttons"],
});
