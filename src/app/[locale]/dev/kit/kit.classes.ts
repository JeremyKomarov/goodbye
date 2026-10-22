import styles from "./kit.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const kitClasses = classMap("KitCatalog", {
  root: styles["kit"],
  section: styles["kit__section"],
  heading: styles["kit__heading"],
  row: styles["kit__row"],
  column: styles["kit__column"],
});
