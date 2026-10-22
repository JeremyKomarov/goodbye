import styles from "./LandingScreen.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const landingScreenClasses = classMap("LandingScreen", {
  root: styles["landing-screen"],
  intro: styles["landing-screen__intro"],
  chat: styles["landing-screen__chat"],
  panel: styles["landing-screen__panel"],
});
