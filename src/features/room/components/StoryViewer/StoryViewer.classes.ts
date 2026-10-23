import styles from "./StoryViewer.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const storyViewerClasses = classMap("StoryViewer", {
  groups: styles["story-viewer__groups"],
  current: styles["story-viewer__group--current"],
  group: styles["story-viewer__group"],
  fact: styles["story-viewer__fact"],
});
