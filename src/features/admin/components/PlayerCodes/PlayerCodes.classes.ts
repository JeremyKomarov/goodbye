import styles from "./PlayerCodes.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const playerCodesClasses = classMap("PlayerCodes", {
  root: styles["player-codes"],
  title: styles["player-codes__title"],
  help: styles["player-codes__help"],
  list: styles["player-codes__list"],
  item: styles["player-codes__item"],
  name: styles["player-codes__name"],
  code: styles["player-codes__code"],
  pending: styles["player-codes__pending"],
  send: styles["player-codes__send"],
});
