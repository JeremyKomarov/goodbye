import styles from "./VoteHeatmap.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const voteHeatmapClasses = classMap("VoteHeatmap", {
  root: styles["vote-heatmap"],
  head: styles["vote-heatmap__head"],
  title: styles["vote-heatmap__title"],
  hint: styles["vote-heatmap__hint"],
});
