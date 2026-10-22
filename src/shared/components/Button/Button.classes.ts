import styles from "./Button.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const buttonClasses = classMap("Button", {
  root: styles["button"],
  label: styles["button__label"],
  spinner: styles["button__spinner"],
  loadingText: styles["button__loading-text"],
  iconOnly: styles["button--icon-only"],
  loading: styles["button--loading"],
  fullWidth: styles["button--full-width"],
  variant: {
    primary: styles["button--primary"],
    secondary: styles["button--secondary"],
    ghost: styles["button--ghost"],
    danger: styles["button--danger"],
    link: styles["button--link"],
    bare: styles["button--bare"],
  },
  size: {
    sm: styles["button--sm"],
    md: styles["button--md"],
    lg: styles["button--lg"],
  },
});
