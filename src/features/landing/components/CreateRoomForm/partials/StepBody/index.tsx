import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type {
  FormStepKey,
} from "@/features/landing/components/CreateRoomForm/CreateRoomForm.const";
import { LANDING_NAMESPACE, landingKeys } from "@/features/landing/strings/landing.keys.const";
import { cn } from "@/shared/utils/cn";
import { stepBodyClasses } from "./StepBody.classes";

const SLIDE = 24;

/**
 * One step: its title and line under it, then its fields. Always mounted, so it holds its height;
 * `offset` is how far it is from the current step — 0 shows it, a step behind slides out one way
 * and a step ahead the other, hidden and out of the tab order.
 */
export function StepBody({
  stepKey,
  offset,
  children,
}: {
  stepKey: FormStepKey;
  offset: number;
  children: ReactNode;
}) {
  const t = useTranslations(LANDING_NAMESPACE);
  const steps = landingKeys.wizard.steps;
  const isCurrent = offset === 0;

  return (
    <motion.fieldset
      initial={false}
      animate={{ opacity: isCurrent ? 1 : 0, x: Math.sign(offset) * -SLIDE }}
      transition={{ duration: 0.18 }}
      className={cn(stepBodyClasses.root, !isCurrent && stepBodyClasses.hidden)}
      inert={!isCurrent}
      aria-hidden={!isCurrent}
    >
      <legend className={stepBodyClasses.legend}>
        <span className={stepBodyClasses.title}>{t(steps[stepKey].title)}</span>
        <span className={stepBodyClasses.sub}>{t(steps[stepKey].sub)}</span>
      </legend>
      {children}
    </motion.fieldset>
  );
}
