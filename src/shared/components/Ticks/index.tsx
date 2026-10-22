import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { ticksClasses } from "./Ticks.classes";
import { TICK_STATES, type TickState } from "./Ticks.const";

/** WhatsApp's check marks: one grey, two grey, two blue. Decorative. */
export function Ticks({
  state = TICK_STATES.read,
  className,
}: {
  state?: TickState;
  className?: string;
}) {
  return (
    <span className={cn(ticksClasses.root, ticksClasses.state[state], className)} aria-hidden>
      <Icon
        name={state === TICK_STATES.sent ? ICON_NAMES.check : ICON_NAMES.checkDouble}
        size="sm"
      />
    </span>
  );
}

export { TICK_STATES, type TickState };
