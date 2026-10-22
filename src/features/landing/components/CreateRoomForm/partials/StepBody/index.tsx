import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type {
  FormStepKey,
} from "@/features/landing/components/CreateRoomForm/CreateRoomForm.const";
import { LANDING_NAMESPACE, landingKeys } from "@/features/landing/strings/landing.keys.const";
import { stepBodyClasses } from "./StepBody.classes";

/** One step: its title and line under it, then its fields. Slides in, and out the other way. */
export function StepBody({ stepKey, children }: { stepKey: FormStepKey; children: ReactNode }) {
  const t = useTranslations(LANDING_NAMESPACE);
  const steps = landingKeys.wizard.steps;

  return (
    <motion.fieldset
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.18 }}
      className={stepBodyClasses.root}
    >
      <legend className={stepBodyClasses.legend}>
        <span className={stepBodyClasses.title}>{t(steps[stepKey].title)}</span>
        <span className={stepBodyClasses.sub}>{t(steps[stepKey].sub)}</span>
      </legend>
      {children}
    </motion.fieldset>
  );
}
