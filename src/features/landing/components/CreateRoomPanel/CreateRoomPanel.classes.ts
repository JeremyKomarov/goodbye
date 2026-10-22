import styles from "./CreateRoomPanel.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const createRoomPanelClasses = classMap("CreateRoomPanel", {
  root: styles["create-room-panel"],
  heading: styles["create-room-panel__heading"],
});
