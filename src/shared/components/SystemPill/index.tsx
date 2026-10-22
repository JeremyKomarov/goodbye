import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";
import { systemPillClasses } from "./SystemPill.classes";
import { SYSTEM_PILL_TONES, type SystemPillTone } from "./SystemPill.const";

export function SystemPill({
  tone = SYSTEM_PILL_TONES.default,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { tone?: SystemPillTone }) {
  return (
    <div {...rest} className={cn(systemPillClasses.root, systemPillClasses.tone[tone], className)} />
  );
}

export { SYSTEM_PILL_TONES, type SystemPillTone };
