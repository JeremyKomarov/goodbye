import styles from "./VoteReminder.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const voteReminderClasses = classMap("VoteReminder", {
  root: styles["vote-reminder"],
  title: styles["vote-reminder__title"],
  count: styles["vote-reminder__count"],
  bar: styles["vote-reminder__bar"],
  help: styles["vote-reminder__help"],
  names: styles["vote-reminder__names"],
  name: styles["vote-reminder__name"],
  send: styles["vote-reminder__send"],
});
