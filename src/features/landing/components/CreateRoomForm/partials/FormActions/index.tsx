import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { useOpenSlotCount } from "@/features/landing/hooks/useOpenSlotCount";
import { LANDING_NAMESPACE, landingKeys } from "@/features/landing/strings/landing.keys.const";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { formActionsClasses } from "./FormActions.classes";

/**
 * Back — an icon, so "Create" keeps its whole label on a phone — and the submit button: "Next",
 * "Skip" on the first step with no story picked, and "Create" on the last, which waits until the
 * window leaves at least one hour to vote on. On the last step, how many hours that is sits above
 * the buttons, outside the scrolling step, so the host sees it change as they set the window.
 */
export function FormActions({
  isFirst,
  isLast,
  isLoading,
  onBack,
}: {
  isFirst: boolean;
  isLast: boolean;
  isLoading: boolean;
  onBack: () => void;
}) {
  const t = useTranslations(LANDING_NAMESPACE);
  const wizard = landingKeys.wizard;
  const story = useWatch<CreateRoomInput, "reason">({ name: "reason" });
  const openSlots = useOpenSlotCount();
  const label = isLast ? wizard.create : isFirst && story === null ? wizard.skip : wizard.next;

  return (
    <div className={formActionsClasses.root}>
      {/* Always rendered, so a laptop's card can keep its room on every step (see the styles). */}
      <p
        className={cn(
          formActionsClasses.slots,
          openSlots === 0 && formActionsClasses.noSlots,
          !isLast && formActionsClasses.slotsAhead,
        )}
        aria-hidden={!isLast}
        aria-live="polite"
      >
        {openSlots > 0 ? t(wizard.openSlots, { count: openSlots }) : t(wizard.noOpenSlots)}
      </p>
      <div className={formActionsClasses.buttons}>
        {!isFirst && (
          <Button
            variant={BUTTON_VARIANTS.secondary}
            size={BUTTON_SIZES.lg}
            icon={ICON_NAMES.back}
            aria-label={t(wizard.back)}
            onClick={onBack}
          />
        )}
        <Button
          type="submit"
          size={BUTTON_SIZES.lg}
          fullWidth
          isLoading={isLoading}
          disabled={isLast && openSlots === 0}
        >
          {t(label)}
        </Button>
      </div>
    </div>
  );
}
