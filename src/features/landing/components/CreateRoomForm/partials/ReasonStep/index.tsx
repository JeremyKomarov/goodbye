import { useTranslations } from "next-intl";
import { useController, useWatch } from "react-hook-form";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { ChoiceGroup } from "@/shared/components/ChoiceGroup";
import { REASON_CARDS } from "./ReasonStep.const";
import { REASON_STEP_NAMESPACE, reasonStepKeys } from "./ReasonStep.keys.const";

/** Why the host is leaving. Optional: the picked card can be picked again to clear it. */
export function ReasonStep() {
  const t = useTranslations(REASON_STEP_NAMESPACE);
  const { field } = useController<CreateRoomInput, "reason">({ name: "reason" });
  const gender = useWatch<CreateRoomInput, "hostGender">({ name: "hostGender" });
  const options = REASON_CARDS.map(({ value, emoji }) => ({
    value,
    leading: emoji,
    label: t(reasonStepKeys.reasons[value].label),
    description: t(reasonStepKeys.reasons[value].tagline, { gender }),
  }));

  return (
    <ChoiceGroup
      label={t(reasonStepKeys.label)}
      options={options}
      value={field.value}
      onChange={field.onChange}
      isClearable
    />
  );
}
