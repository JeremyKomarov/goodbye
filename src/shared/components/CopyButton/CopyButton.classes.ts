import styles from "./CopyButton.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const copyButtonClasses = classMap("CopyButton", {
  root: styles["copy-button"],
  copied: styles["copy-button--copied"],
});
