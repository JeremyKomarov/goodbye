import styles from "./ScheduleStep.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const scheduleStepClasses = classMap("ScheduleStep", {
  row: styles["schedule-step__row"],
  hours: styles["schedule-step__hours"],
  stepper: styles["schedule-step__stepper"],
  stepperLabel: styles["schedule-step__stepper-label"],
  stepperControls: styles["schedule-step__stepper-controls"],
  stepperValue: styles["schedule-step__stepper-value"],
  slots: styles["schedule-step__slots"],
  noSlots: styles["schedule-step__slots--none"],
});
