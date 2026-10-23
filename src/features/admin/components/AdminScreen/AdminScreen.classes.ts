import styles from "./AdminScreen.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const adminScreenClasses = classMap("AdminScreen", {
  root: styles["admin-screen"],
  head: styles["admin-screen__head"],
  back: styles["admin-screen__back"],
  title: styles["admin-screen__title"],
  group: styles["admin-screen__group"],
  private: styles["admin-screen__private"],
  grid: styles["admin-screen__grid"],
  column: styles["admin-screen__column"],
  message: styles["admin-screen__message"],
});
