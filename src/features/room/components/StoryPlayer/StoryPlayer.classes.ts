import styles from "./StoryPlayer.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const storyPlayerClasses = classMap("StoryPlayer", {
  root: styles["story-player"],
  bars: styles["story-player__bars"],
  bar: styles["story-player__bar"],
  fill: styles["story-player__fill"],
  full: styles["story-player__fill--full"],
  stage: styles["story-player__stage"],
  slide: styles["story-player__slide"],
  steps: styles["story-player__steps"],
  hint: styles["story-player__hint"],
});
