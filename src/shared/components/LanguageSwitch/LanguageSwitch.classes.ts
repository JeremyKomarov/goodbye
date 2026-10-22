import styles from "./LanguageSwitch.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const languageSwitchClasses = classMap("LanguageSwitch", {
  root: styles["language-switch"],
  option: styles["language-switch__option"],
});
