import styles from "./StoryViewer.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const storyViewerClasses = classMap("StoryViewer", {
  root: styles["story-viewer"],
  bars: styles["story-viewer__bars"],
  bar: styles["story-viewer__bar"],
  fill: styles["story-viewer__fill"],
  full: styles["story-viewer__fill--full"],
  groups: styles["story-viewer__groups"],
  current: styles["story-viewer__group--current"],
  group: styles["story-viewer__group"],
  stage: styles["story-viewer__stage"],
  fact: styles["story-viewer__fact"],
  steps: styles["story-viewer__steps"],
  hint: styles["story-viewer__hint"],
});
