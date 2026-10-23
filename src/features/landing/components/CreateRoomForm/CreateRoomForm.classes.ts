import styles from "./CreateRoomForm.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const createRoomFormClasses = classMap("CreateRoomForm", {
  root: styles["create-room-form"],
  steps: styles["create-room-form__steps"],
});
