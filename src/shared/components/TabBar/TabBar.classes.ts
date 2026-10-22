import styles from "./TabBar.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const tabBarClasses = classMap("TabBar", {
  root: styles["tab-bar"],
  list: styles["tab-bar__list"],
  link: styles["tab-bar__link"],
  glyph: styles["tab-bar__glyph"],
  badge: styles["tab-bar__badge"],
  hidden: styles["tab-bar__hidden"],
  text: styles["tab-bar__text"],
  line: styles["tab-bar__line"],
  label: styles["tab-bar__label"],
  meta: styles["tab-bar__meta"],
  subtitle: styles["tab-bar__subtitle"],
  live: styles["tab-bar__subtitle--live"],
  variant: {
    bar: styles["tab-bar--bar"],
    list: styles["tab-bar--list"],
  },
});
