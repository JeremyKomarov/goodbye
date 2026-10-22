import styles from "./Skeleton.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const skeletonClasses = classMap("Skeleton", {
  root: styles["skeleton"],
  shape: {
    line: styles["skeleton--line"],
    block: styles["skeleton--block"],
    circle: styles["skeleton--circle"],
  },
});
