import styles from "./VoteSection.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const voteSectionClasses = classMap("VoteSection", {
  root: styles["vote-section"],
  hero: styles["vote-section__hero"],
  stories: styles["vote-section__stories"],
  grid: styles["vote-section__grid"],
});
