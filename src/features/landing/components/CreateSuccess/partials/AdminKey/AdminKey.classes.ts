import styles from "./AdminKey.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const adminKeyClasses = classMap("AdminKey", {
  root: styles["admin-key"],
  title: styles["admin-key__title"],
  icon: styles["admin-key__icon"],
  why: styles["admin-key__why"],
});
