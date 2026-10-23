import styles from "./AdminWall.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const adminWallClasses = classMap("AdminWall", {
  root: styles["admin-wall"],
  head: styles["admin-wall__head"],
  title: styles["admin-wall__title"],
  count: styles["admin-wall__count"],
  empty: styles["admin-wall__empty"],
  list: styles["admin-wall__list"],
  item: styles["admin-wall__item"],
  text: styles["admin-wall__text"],
  name: styles["admin-wall__name"],
  body: styles["admin-wall__body"],
});
