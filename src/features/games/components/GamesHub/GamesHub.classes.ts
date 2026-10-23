import styles from "./GamesHub.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const gamesHubClasses = classMap("GamesHub", {
  root: styles["games-hub"],
  list: styles["games-hub__list"],
  tile: styles["games-hub__tile"],
  closed: styles["games-hub__tile--closed"],
  art: styles["games-hub__art"],
  accent: {
    runaway: styles["games-hub__art--runaway"],
    trivia: styles["games-hub__art--trivia"],
    catch: styles["games-hub__art--catch"],
    picture: styles["games-hub__art--picture"],
  },
  text: styles["games-hub__text"],
  title: styles["games-hub__title"],
  blurb: styles["games-hub__blurb"],
  record: styles["games-hub__record"],
  holder: styles["games-hub__holder"],
  score: styles["games-hub__score"],
  best: styles["games-hub__best"],
});
