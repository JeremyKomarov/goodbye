import { motion } from "motion/react";
import { stepProgressClasses } from "./StepProgress.classes";

/** One bar per step, filled up to this one, and "2/3". Decorative: each step has its title. */
export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className={stepProgressClasses.root} aria-hidden>
      <div className={stepProgressClasses.bars}>
        {Array.from({ length: total }, (_, index) => (
          <div key={index} className={stepProgressClasses.bar}>
            <motion.div
              className={stepProgressClasses.fill}
              initial={false}
              animate={{ width: index <= step ? "100%" : "0%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
            />
          </div>
        ))}
      </div>
      <span dir="ltr" className={stepProgressClasses.count}>
        {step + 1}/{total}
      </span>
    </div>
  );
}
