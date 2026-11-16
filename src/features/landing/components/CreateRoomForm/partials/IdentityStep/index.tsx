import { useTranslations } from "next-intl";
import { useController, useFormContext, useWatch } from "react-hook-form";
import {
  HOST_GENDERS, type CreateRoomInput,
} from "@/features/landing/api/rooms.dto";
import { useWizardErrors } from "@/features/landing/hooks/useWizardErrors";
import { CHOICE_GROUP_VARIANTS, ChoiceGroup } from "@/shared/components/ChoiceGroup";
import { Field } from "@/shared/components/Field";
import { SystemPill } from "@/shared/components/SystemPill";
import { isolate } from "@/shared/utils/isolate";
import { identityStepClasses } from "./IdentityStep.classes";
import { IDENTITY_STEP_NAMESPACE, identityStepKeys } from "./IdentityStep.keys.const";

/**
 * Who is leaving which group, and how to word it — previewed as the line the group will see. The
 * names have no `maxLength`: it counts UTF-16 units, so an emoji would end a name early. The
 * schema counts characters and says so.
 */
export function IdentityStep() {
  const t = useTranslations(IDENTITY_STEP_NAMESPACE);
  const { register } = useFormContext<CreateRoomInput>();
  const { field: gender } = useController<CreateRoomInput, "hostGender">({ name: "hostGender" });
  const hostName = useWatch<CreateRoomInput, "hostName">({ name: "hostName" });
  const errors = useWizardErrors();
  const genders = Object.values(HOST_GENDERS).map((value) => ({
    value,
    label: t(identityStepKeys.genders[value]),
  }));
  const name = hostName.trim() || t(identityStepKeys.hostNamePlaceholder);

  return (
    <>
      <div className={identityStepClasses.fields}>
        <Field
          label={t(identityStepKeys.hostName)}
          placeholder={t(identityStepKeys.hostNamePlaceholder)}
          autoComplete="given-name"
          error={errors.field("hostName")}
          {...register("hostName")}
        />
        <Field
          label={t(identityStepKeys.groupName)}
          placeholder={t(identityStepKeys.groupNamePlaceholder)}
          error={errors.field("groupName")}
          {...register("groupName")}
        />
      </div>
      <div className={identityStepClasses.pronoun}>
        <ChoiceGroup
          variant={CHOICE_GROUP_VARIANTS.segment}
          label={t(identityStepKeys.genderLabel)}
          options={genders}
          value={gender.value}
          onChange={(value) => value && gender.onChange(value)}
        />
        <SystemPill>
          {t(identityStepKeys.preview, { name: isolate(name), gender: gender.value })}
        </SystemPill>
      </div>
    </>
  );
}
