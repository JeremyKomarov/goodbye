import styles from "./PictureGame.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const pictureGameClasses = classMap("PictureGame", {
  root: styles["picture-game"],
  intro: styles["picture-game__intro"],
  lead: styles["picture-game__lead"],
  rules: styles["picture-game__rules"],
  bar: styles["picture-game__bar"],
  score: styles["picture-game__score"],
  play: styles["picture-game__play"],
  frame: styles["picture-game__frame"],
  picture: styles["picture-game__picture"],
  panel: styles["picture-game__panel"],
  form: styles["picture-game__form"],
  row: styles["picture-game__row"],
  input: styles["picture-game__input"],
  verdict: styles["picture-game__verdict"],
  tone: {
    right: styles["picture-game__verdict--right"],
    wrong: styles["picture-game__verdict--wrong"],
    skipped: styles["picture-game__verdict--skipped"],
  },
});
