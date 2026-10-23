import styles from "./GameScreen.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const gameScreenClasses = classMap("GameScreen", {
  root: styles["game-screen"],
  head: styles["game-screen__head"],
  back: styles["game-screen__back"],
  heading: styles["game-screen__heading"],
  title: styles["game-screen__title"],
  stage: styles["game-screen__stage"],
  result: styles["game-screen__result"],
  verdict: styles["game-screen__verdict"],
  score: styles["game-screen__score"],
  place: styles["game-screen__place"],
  error: styles["game-screen__error"],
  actions: styles["game-screen__actions"],
  all: styles["game-screen__all"],
});
