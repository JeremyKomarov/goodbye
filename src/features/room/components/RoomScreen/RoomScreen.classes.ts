import styles from "./RoomScreen.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomScreenClasses = classMap("RoomScreen", {
  root: styles["room-screen"],
  main: styles["room-screen__main"],
});
