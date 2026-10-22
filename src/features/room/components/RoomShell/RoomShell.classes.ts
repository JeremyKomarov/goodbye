import styles from "./RoomShell.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomShellClasses = classMap("RoomShell", {
  root: styles["room-shell"],
  body: styles["room-shell__body"],
  side: styles["room-shell__side"],
  main: styles["room-shell__main"],
});
