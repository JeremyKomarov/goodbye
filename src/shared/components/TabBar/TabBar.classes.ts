import styles from "./TabBar.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const tabBarClasses = classMap("TabBar", {
  root: styles["tab-bar"],
  list: styles["tab-bar__list"],
  link: styles["tab-bar__link"],
  glyph: styles["tab-bar__glyph"],
  badge: styles["tab-bar__badge"],
  hidden: styles["tab-bar__hidden"],
});
