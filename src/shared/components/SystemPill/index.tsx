import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";
import { systemPillClasses } from "./SystemPill.classes";
import { SYSTEM_PILL_TONES, type SystemPillTone } from "./SystemPill.const";

/**
 * WhatsApp's small centred notice. `as="h1"` when it is the page's title — a whole-page notice —
 * so a screen reader finds it among the headings; it looks the same either way.
 */
export function SystemPill({
  tone = SYSTEM_PILL_TONES.default,
  as: Tag = "div",
  className,
  ...rest
}: HTMLAttributes<HTMLElement> & { tone?: SystemPillTone; as?: "div" | "h1" }) {
  return (
    <Tag
      {...rest}
      className={cn(systemPillClasses.root, systemPillClasses.tone[tone], className)}
    />
  );
}

export { SYSTEM_PILL_TONES, type SystemPillTone };
