import styles from "./ChoiceGroup.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const choiceGroupClasses = classMap("ChoiceGroup", {
  root: styles["choice-group"],
  option: styles["choice-group__option"],
  input: styles["choice-group__input"],
  leading: styles["choice-group__leading"],
  text: styles["choice-group__text"],
  label: styles["choice-group__label"],
  description: styles["choice-group__description"],
  mark: styles["choice-group__mark"],
  variant: {
    card: styles["choice-group--card"],
    segment: styles["choice-group--segment"],
  },
});
