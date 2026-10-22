import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { useOpenSlotCount } from "@/features/landing/hooks/useOpenSlotCount";
import { LANDING_NAMESPACE, landingKeys } from "@/features/landing/strings/landing.keys.const";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { formActionsClasses } from "./FormActions.classes";

/**
 * Back, and the submit button: "Next" — "Skip" on the first step with no story picked — and
 * "Create" on the last, which waits until the window leaves at least one hour to vote on.
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
      {!isFirst && (
        <Button variant={BUTTON_VARIANTS.secondary} size={BUTTON_SIZES.lg} onClick={onBack}>
          {t(wizard.back)}
        </Button>
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
  );
}
