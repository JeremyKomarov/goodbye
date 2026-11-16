import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { MAX_WINDOW_DAYS, type CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { useWizardErrors } from "@/features/landing/hooks/useWizardErrors";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { ICON_NAMES } from "@/shared/components/Icon";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import { cn } from "@/shared/utils/cn";
import { fromLocalDateTimeInput, toLocalDateTimeInput } from "@/shared/utils/localDateTime";
import { scheduleStepClasses } from "./ScheduleStep.classes";
import { END_HOURS, hourLabel, START_HOURS } from "./ScheduleStep.const";
import { SCHEDULE_STEP_NAMESPACE, scheduleStepKeys } from "./ScheduleStep.keys.const";

/**
 * The window the group votes in — days and hours of the day — and when voting closes. The close
 * comes set (a few hours from now) and reads as one line; "change" opens its field, and so does an
 * error on it, from the schema or the server. How many hours the window leaves to vote on is said
 * above "Create" (FormActions), where it stays in sight however the step scrolls.
 */
export function ScheduleStep() {
  const t = useTranslations(SCHEDULE_STEP_NAMESPACE);
  const { register } = useFormContext<CreateRoomInput>();
  const { field: days } = useController<CreateRoomInput, "days">({ name: "days" });
  const {
    field: { ref: closesAtRef, value: closesAt, onChange: setClosesAt, onBlur, name },
  } = useController<CreateRoomInput, "votingClosesAt">({ name: "votingClosesAt" });
  const errors = useWizardErrors();
  const closeError = errors.field("votingClosesAt");
  const timezone = useWatch<CreateRoomInput, "timezone">({ name: "timezone" });
  const format = useSlotFormat(timezone);
  const [isEditingClose, setEditingClose] = useState(false);
  const isCloseOpen = isEditingClose || closeError !== undefined;
  const closeField = useRef<HTMLInputElement | null>(null);
  const daysLabel = useId();

  // Opened by "change": the field takes the focus the button had.
  useEffect(() => {
    if (isEditingClose) closeField.current?.focus();
  }, [isEditingClose]);

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

      {isCloseOpen ? (
        <Field
          type="datetime-local"
          label={t(scheduleStepKeys.votingClosesAt)}
          error={closeError}
          name={name}
          ref={(element: HTMLInputElement | null) => {
            closeField.current = element;
            closesAtRef(element);
          }}
          value={closesAt ? toLocalDateTimeInput(Date.parse(closesAt)) : ""}
          onChange={(event) => setClosesAt(fromLocalDateTimeInput(event.target.value))}
          onBlur={onBlur}
        />
      ) : (
        <p className={scheduleStepClasses.closes}>
          {t(scheduleStepKeys.closesSummary, { when: format.slot(Date.parse(closesAt)) })}{" "}
          <Button variant={BUTTON_VARIANTS.link} onClick={() => setEditingClose(true)}>
            {t(scheduleStepKeys.changeClose)}
          </Button>
        </p>
      )}
    </>
  );
}
