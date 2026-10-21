import styles from "./Icon.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const iconClasses = classMap("Icon", {
  root: styles["icon"],
  mirrored: styles["icon--mirrored"],
});
