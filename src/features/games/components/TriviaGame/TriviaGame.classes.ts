import styles from "./TriviaGame.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const triviaGameClasses = classMap("TriviaGame", {
  root: styles["trivia-game"],
  intro: styles["trivia-game__intro"],
  lead: styles["trivia-game__lead"],
  bar: styles["trivia-game__bar"],
  score: styles["trivia-game__score"],
  clock: styles["trivia-game__clock"],
  fill: styles["trivia-game__fill"],
  hurry: styles["trivia-game__fill--hurry"],
  body: styles["trivia-game__body"],
  question: styles["trivia-game__question"],
  options: styles["trivia-game__options"],
  option: styles["trivia-game__option"],
  tone: {
    idle: styles["trivia-game__option--idle"],
    right: styles["trivia-game__option--right"],
    wrong: styles["trivia-game__option--wrong"],
    dim: styles["trivia-game__option--dim"],
  },
  verdict: styles["trivia-game__verdict"],
  said: styles["trivia-game__said"],
  fact: styles["trivia-game__fact"],
});
