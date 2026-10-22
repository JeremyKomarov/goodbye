import styles from "./RoomNotFound.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomNotFoundClasses = classMap("RoomNotFound", {
  root: styles["room-not-found"],
  why: styles["room-not-found__why"],
  open: styles["room-not-found__open"],
});
