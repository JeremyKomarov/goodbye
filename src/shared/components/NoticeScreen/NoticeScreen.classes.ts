import styles from "./NoticeScreen.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const noticeScreenClasses = classMap("NoticeScreen", {
  root: styles["notice-screen"],
  why: styles["notice-screen__why"],
  actions: styles["notice-screen__actions"],
  link: styles["notice-screen__link"],
});
