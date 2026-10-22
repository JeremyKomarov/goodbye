import styles from "./VoteDetail.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const voteDetailClasses = classMap("VoteDetail", {
  root: styles["vote-detail"],
  error: styles["vote-detail__error"],
  idle: styles["vote-detail__idle"],
  slot: styles["vote-detail__slot"],
  count: styles["vote-detail__count"],
  row: styles["vote-detail__row"],
  names: styles["vote-detail__names"],
  withdraw: styles["vote-detail__withdraw"],
});
