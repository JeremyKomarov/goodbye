import styles from "./RoomNav.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomNavClasses = classMap("RoomNav", {
  bar: styles["room-nav__bar"],
  list: styles["room-nav__list"],
});
