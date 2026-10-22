import styles from "./MeSheet.module.scss";
import { classMap } from "@/shared/utils/classMap";

// Shared with the sheet's three partials, which are its sections.
export const meSheetClasses = classMap("MeSheet", {
  root: styles["me-sheet"],
  section: styles["me-sheet__section"],
  heading: styles["me-sheet__heading"],
  text: styles["me-sheet__text"],
  row: styles["me-sheet__row"],
  code: styles["me-sheet__code"],
  alert: styles["me-sheet__alert"],
});
