import styles from "./JoinGate.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const joinGateClasses = classMap("JoinGate", {
  root: styles["join-gate"],
  form: styles["join-gate__form"],
  top: styles["join-gate__top"],
  group: styles["join-gate__group"],
  headline: styles["join-gate__headline"],
  lede: styles["join-gate__lede"],
  alert: styles["join-gate__alert"],
});
