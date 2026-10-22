import styles from "./Field.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const fieldClasses = classMap("Field", {
  root: styles["field"],
  label: styles["field__label"],
  labelHidden: styles["field__label--hidden"],
  control: styles["field__control"],
  select: styles["field__control--select"],
  helper: styles["field__helper"],
  error: styles["field__error"],
});
