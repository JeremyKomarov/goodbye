import styles from "./PictureStage.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const pictureStageClasses = classMap("PictureStage", {
  root: styles["picture-stage"],
  layer: styles["picture-stage__layer"],
  icon: styles["picture-stage__icon"],
  curtain: styles["picture-stage__curtain"],
  mark: styles["picture-stage__mark"],
});
