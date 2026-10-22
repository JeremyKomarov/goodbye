import styles from "./ServerAlert.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const serverAlertClasses = classMap("ServerAlert", {
  root: styles["server-alert"],
});
