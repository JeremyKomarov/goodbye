import styles from "./AdminControls.module.scss";
import { classMap } from "@/shared/utils/classMap";

// Shared with the ReopenForm partial.
export const adminControlsClasses = classMap("AdminControls", {
  root: styles["admin-controls"],
  card: styles["admin-controls__card"],
  label: styles["admin-controls__label"],
  status: styles["admin-controls__status"],
  help: styles["admin-controls__help"],
  alert: styles["admin-controls__alert"],
  row: styles["admin-controls__row"],
});
