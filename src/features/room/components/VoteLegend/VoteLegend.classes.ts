import styles from "./VoteLegend.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const voteLegendClasses = classMap("VoteLegend", {
  root: styles["vote-legend"],
  swatch: styles["vote-legend__swatch"],
  shade: {
    1: styles["vote-legend__swatch--1"],
    2: styles["vote-legend__swatch--2"],
    3: styles["vote-legend__swatch--3"],
    4: styles["vote-legend__swatch--4"],
    5: styles["vote-legend__swatch--5"],
  },
});
