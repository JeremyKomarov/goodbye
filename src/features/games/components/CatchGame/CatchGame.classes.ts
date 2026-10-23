import styles from "./CatchGame.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const catchGameClasses = classMap("CatchGame", {
  root: styles["catch-game"],
  bar: styles["catch-game__bar"],
  count: styles["catch-game__count"],
  hurry: styles["catch-game__count--hurry"],
  arena: styles["catch-game__arena"],
  intro: styles["catch-game__intro"],
  lead: styles["catch-game__lead"],
  rules: styles["catch-game__rules"],
  notice: styles["catch-game__notice"],
  kind: {
    message: styles["catch-game__notice--message"],
    flower: styles["catch-game__notice--flower"],
    boss: styles["catch-game__notice--boss"],
    exit: styles["catch-game__notice--exit"],
  },
  points: styles["catch-game__points"],
  lost: styles["catch-game__points--lost"],
});
