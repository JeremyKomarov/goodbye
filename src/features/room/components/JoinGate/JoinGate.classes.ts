import styles from "./JoinGate.module.scss";
import { classMap } from "@/shared/utils/classMap";

// Shared with the NameForm and CodeForm partials, which are the card's lower half.
export const joinGateClasses = classMap("JoinGate", {
  root: styles["join-gate"],
  card: styles["join-gate__card"],
  top: styles["join-gate__top"],
  group: styles["join-gate__group"],
  headline: styles["join-gate__headline"],
  lede: styles["join-gate__lede"],
  form: styles["join-gate__form"],
  question: styles["join-gate__question"],
  code: styles["join-gate__code"],
  alert: styles["join-gate__alert"],
});
