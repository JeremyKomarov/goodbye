import styles from "./RoomSkeleton.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomSkeletonClasses = classMap("RoomSkeleton", {
  root: styles["room-skeleton"],
  header: styles["room-skeleton__header"],
  lines: styles["room-skeleton__lines"],
  body: styles["room-skeleton__body"],
});
