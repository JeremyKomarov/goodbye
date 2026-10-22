import styles from "./LinkRow.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const linkRowClasses = classMap("LinkRow", {
  root: styles["link-row"],
  label: styles["link-row__label"],
  box: styles["link-row__box"],
  url: styles["link-row__url"],
  tone: {
    plain: styles["link-row--plain"],
    secret: styles["link-row--secret"],
  },
});
