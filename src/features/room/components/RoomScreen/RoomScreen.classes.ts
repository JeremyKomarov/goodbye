import styles from "./RoomScreen.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomScreenClasses = classMap("RoomScreen", {
  root: styles["room-screen"],
  body: styles["room-screen__body"],
  side: styles["room-screen__side"],
  main: styles["room-screen__main"],
});
