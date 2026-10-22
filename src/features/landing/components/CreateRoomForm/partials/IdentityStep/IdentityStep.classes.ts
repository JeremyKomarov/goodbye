import styles from "./IdentityStep.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const identityStepClasses = classMap("IdentityStep", {
  fields: styles["identity-step__fields"],
  pronoun: styles["identity-step__pronoun"],
});
