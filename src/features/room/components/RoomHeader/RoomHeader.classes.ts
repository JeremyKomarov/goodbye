import styles from "./RoomHeader.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const roomHeaderClasses = classMap("RoomHeader", {
  root: styles["room-header"],
  bar: styles["room-header__bar"],
  avatar: styles["room-header__avatar"],
  text: styles["room-header__text"],
  title: styles["room-header__title"],
  subtitle: styles["room-header__subtitle"],
  live: styles["room-header__subtitle--live"],
  clock: styles["room-header__clock"],
  clockLocked: styles["room-header__clock--locked"],
  end: styles["room-header__end"],
});
