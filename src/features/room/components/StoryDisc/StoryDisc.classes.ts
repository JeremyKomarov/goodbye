import styles from "./StoryDisc.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const storyDiscClasses = classMap("StoryDisc", {
  root: styles["story-disc"],
  seen: styles["story-disc--seen"],
  inner: styles["story-disc__inner"],
  size: {
    sm: styles["story-disc--sm"],
    md: styles["story-disc--md"],
    lg: styles["story-disc--lg"],
  },
});
