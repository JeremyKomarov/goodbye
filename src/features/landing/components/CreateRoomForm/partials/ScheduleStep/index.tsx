import { useTranslations } from "next-intl";
import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";
import { MAX_WINDOW_DAYS, type CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { useOpenSlotCount } from "@/features/landing/hooks/useOpenSlotCount";
import { useWizardErrors } from "@/features/landing/hooks/useWizardErrors";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { ICON_NAMES } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { fromLocalDateTimeInput, toLocalDateTimeInput } from "@/shared/utils/localDateTime";
import { scheduleStepClasses } from "./ScheduleStep.classes";
import { END_HOURS, hourLabel, START_HOURS } from "./ScheduleStep.const";
import { SCHEDULE_STEP_NAMESPACE, scheduleStepKeys } from "./ScheduleStep.keys.const";

/** The window the group votes in — days and hours of the day — and when voting closes. */
export function ScheduleStep() {
  const t = useTranslations(SCHEDULE_STEP_NAMESPACE);
  const { register } = useFormContext<CreateRoomInput>();
  const { field: days } = useController<CreateRoomInput, "days">({ name: "days" });
  const {
    field: { ref: closesAtRef, value: closesAt, onChange: setClosesAt, onBlur, name },
  } = useController<CreateRoomInput, "votingClosesAt">({ name: "votingClosesAt" });
  const errors = useWizardErrors();
  const openSlots = useOpenSlotCount();
  const daysLabel = useId();

  return (
    <>
      <div className={cn(scheduleStepClasses.row, scheduleStepClasses.pair)}>
        <Field
          type="date"
          label={t(scheduleStepKeys.windowStart)}
          error={errors.field("windowStart")}
          {...register("windowStart")}
        />
        <div className={scheduleStepClasses.stepper} role="group" aria-labelledby={daysLabel}>
          <span id={daysLabel} className={scheduleStepClasses.stepperLabel}>
            {t(scheduleStepKeys.days)}
          </span>
          <div className={scheduleStepClasses.stepperControls}>
            <Button
              variant={BUTTON_VARIANTS.secondary}
              icon={ICON_NAMES.less}
              aria-label={t(scheduleStepKeys.fewerDays)}
              disabled={days.value <= 1}
              onClick={() => days.onChange(days.value - 1)}
            />
            <output className={scheduleStepClasses.stepperValue} aria-live="polite">
              {days.value}
            </output>
            <Button
              variant={BUTTON_VARIANTS.secondary}
              icon={ICON_NAMES.more}
              aria-label={t(scheduleStepKeys.moreDays)}
              disabled={days.value >= MAX_WINDOW_DAYS}
              onClick={() => days.onChange(days.value + 1)}
            />
          </div>
        </div>
      </div>

      <div className={scheduleStepClasses.row}>
        <div className={scheduleStepClasses.hours}>
          <Field
            as="select"
            label={t(scheduleStepKeys.dayStartHour)}
            {...register("dayStartHour", { valueAsNumber: true })}
          >
            {START_HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hourLabel(hour)}
              </option>
            ))}
          </Field>
          <Field
            as="select"
            label={t(scheduleStepKeys.dayEndHour)}
            error={errors.field("dayEndHour")}
            {...register("dayEndHour", { valueAsNumber: true })}
          >
            {END_HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hourLabel(hour)}
              </option>
            ))}
          </Field>
        </div>
        <Field
          type="datetime-local"
          label={t(scheduleStepKeys.votingClosesAt)}
          error={errors.field("votingClosesAt")}
          name={name}
          ref={closesAtRef}
          value={closesAt ? toLocalDateTimeInput(Date.parse(closesAt)) : ""}
          onChange={(event) => setClosesAt(fromLocalDateTimeInput(event.target.value))}
          onBlur={onBlur}
        />
      </div>

      <p className={cn(scheduleStepClasses.slots, openSlots === 0 && scheduleStepClasses.noSlots)}>
        {openSlots > 0
          ? t(scheduleStepKeys.openSlots, { count: openSlots })
          : t(scheduleStepKeys.noOpenSlots)}
      </p>
    </>
  );
}
