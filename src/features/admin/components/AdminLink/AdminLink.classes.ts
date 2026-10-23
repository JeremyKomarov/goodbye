import styles from "./AdminLink.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const adminLinkClasses = classMap("AdminLink", {
  root: styles["admin-link"],
  title: styles["admin-link__title"],
  help: styles["admin-link__help"],
  row: styles["admin-link__row"],
  url: styles["admin-link__url"],
  send: styles["admin-link__send"],
});
