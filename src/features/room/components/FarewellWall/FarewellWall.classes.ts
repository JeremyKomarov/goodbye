import styles from "./FarewellWall.module.scss";
import { classMap } from "@/shared/utils/classMap";

// Shared with its partials, the list and the composer.
export const farewellWallClasses = classMap("FarewellWall", {
  root: styles["farewell-wall"],
  region: styles["farewell-wall__region"],
  scroller: styles["farewell-wall__scroller"],
  list: styles["farewell-wall__list"],
  intro: styles["farewell-wall__intro"],
  empty: styles["farewell-wall__empty"],
  jump: styles["farewell-wall__jump"],
  composer: styles["farewell-wall__composer"],
  form: styles["farewell-wall__form"],
  input: styles["farewell-wall__input"],
  count: styles["farewell-wall__count"],
  error: styles["farewell-wall__error"],
});
