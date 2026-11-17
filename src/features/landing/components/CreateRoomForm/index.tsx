"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { FormProvider, useForm, type FieldErrors } from "react-hook-form";
import { useLocale } from "next-intl";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { Locale } from "@/core/i18n/routing";
import {
  CreateRoomInputSchema, HOST_GENDERS, type CreateRoomInput,
} from "@/features/landing/api/rooms.dto";
import { useCreateRoom } from "@/features/landing/hooks/useCreateRoom";
import { forgetDraft, loadDraft, saveDraft } from "@/features/landing/utils/wizardDraft";
import { SERVER_ERROR } from "@/features/landing/hooks/useWizardErrors";
import type { ChatPreview, OpenedRoom } from "@/features/landing/types/wizard.types";
import { saveAdminToken } from "@/shared/utils/adminTokens";
import { toLocalDateInput } from "@/shared/utils/localDateTime";
import { createRoomFormClasses } from "./CreateRoomForm.classes";
import {
  DEFAULT_CLOSE_AFTER_HOURS, DEFAULT_DAY_END_HOUR, DEFAULT_DAY_START_HOUR, DEFAULT_DAYS,
  FORM_STEPS,
} from "./CreateRoomForm.const";
import { FormActions } from "./partials/FormActions";
import { IdentityStep } from "./partials/IdentityStep";
import { ReasonStep } from "./partials/ReasonStep";
import { ScheduleStep } from "./partials/ScheduleStep";
import { ServerAlert } from "./partials/ServerAlert";
import { StepBody } from "./partials/StepBody";
import { StepProgress } from "./partials/StepProgress";

const STEP_BODIES = { reason: ReasonStep, who: IdentityStep, when: ScheduleStep };

/** The heights the script measures, for the styles to choose between. */
const TALLEST = "--steps-tallest";
const SHOWING = "--steps-showing";

/**
 * The three-step create wizard, validated by the schema the handler parses (03-DATA.md §4). Its
 * defaults come from the visitor's clock and timezone, so it is mounted in the browser only.
 */
export function CreateRoomForm({
  onCreated,
  onPreview,
}: {
  onCreated: (opened: OpenedRoom) => void;
  onPreview: (preview: ChatPreview) => void;
}) {
  // The room is in the language the host is reading the wizard in; the switch reloads the page.
  const locale = useLocale();
  // This tab's unsent answers, if a reload or a trip to WhatsApp interrupted them (`loadDraft`).
  const [start] = useState(() => {
    const now = Date.now();
    const fresh = initialValues(now, locale);
    const draft = loadDraft(fresh, now);
    return draft
      ? { values: draft.values, step: firstUnfinishedStep(draft.values, draft.step) }
      : { values: fresh, step: 0 };
  });
  const form = useForm<CreateRoomInput>({
    resolver: zodResolver(CreateRoomInputSchema),
    defaultValues: start.values,
    // A field is checked when the host leaves it, and from then on as they type — and so is one
    // "Next" found wrong (`submit`), so an error clears the moment it is fixed.
    mode: "onTouched",
  });
  const createRoom = useCreateRoom();
  const [step, setStep] = useState(start.step);
  const isLast = step === FORM_STEPS.length - 1;
  const stepsRef = useRef<HTMLDivElement>(null);

  // The steps' box is sized in script, before the first paint, so it never shows at one height and
  // then jumps to another. Script measures; the styles choose: on a laptop the box is as tall as the
  // tallest step, so the card keeps one size beside the chat; on a phone it is as tall as the step
  // showing, so a short step leaves its room to the chat above it. The box never scrolls: a screen
  // too short for the step scrolls the page.
  const fitRef = useRef<() => void>(undefined);
  useLayoutEffect(() => {
    const box = stepsRef.current;
    if (!box) return;
    const steps = [...box.children] as HTMLElement[];
    const fit = () => {
      const showing = steps.find((each) => each.getAttribute("aria-hidden") !== "true");
      box.style.setProperty(TALLEST, `${Math.max(...steps.map((each) => each.scrollHeight))}px`);
      box.style.setProperty(SHOWING, `${(showing ?? steps[0]).scrollHeight}px`);
    };
    fit();
    fitRef.current = fit;
    const observer = new ResizeObserver(fit);
    [box, ...steps].forEach((each) => observer.observe(each));
    return () => observer.disconnect();
  }, []);

  // A new step showing sets a new height on a phone.
  useLayoutEffect(() => fitRef.current?.(), [step]);

  // The chat follows the answers, from the first render: a draft given back plays its story.
  useEffect(() => {
    const { reason, hostName, hostGender, groupName } = form.getValues();
    onPreview({ story: reason, hostName, hostGender, groupName });
    return form.subscribe({
      formState: { values: true },
      callback: ({ values: { reason, hostName, hostGender, groupName } }) =>
        onPreview({ story: reason, hostName, hostGender, groupName }),
    });
  }, [form, onPreview]);

  // Every answer and step is kept for this tab until the room is open.
  useEffect(() => {
    saveDraft(form.getValues(), step);
    return form.subscribe({
      formState: { values: true },
      callback: ({ values }) => saveDraft(values, step),
    });
  }, [form, step]);

  function create(input: CreateRoomInput) {
    createRoom.mutate(input, {
      onSuccess: (room) => {
        saveAdminToken(room.slug, room.adminToken);
        forgetDraft();
        onCreated({ room, hostName: input.hostName.trim(), hostGender: input.hostGender });
      },
      onError: (error) => {
        const code = error instanceof ApiError ? error.code : API_ERROR_CODES.internal;
        const field = error instanceof ApiError ? error.field : undefined;
        const at = FORM_STEPS.findIndex((each) => each.fields.some((name) => name === field));
        if (at === -1) return form.setError(SERVER_ERROR, { type: code });
        form.setError(FORM_STEPS[at].fields.find((name) => name === field)!, { type: code });
        setStep(at);
      },
    });
  }

  // "Create" checks every step; one found wrong behind this one is shown, not left out of sight.
  function showFirstError(errors: FieldErrors<CreateRoomInput>) {
    const at = FORM_STEPS.findIndex((each) => each.fields.some((name) => errors[name]));
    if (at !== -1 && at !== step) setStep(at);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    if (isLast) return form.handleSubmit(create, showFirstError)(event);
    event.preventDefault();
    const fields = FORM_STEPS[step].fields;
    if (await form.trigger(fields)) return setStep(step + 1);
    // "Next" by Enter leaves the field without a blur, so it is not touched and would not be
    // checked again as it is fixed. Touch the ones found wrong.
    for (const name of fields) {
      if (form.getFieldState(name).error)
        form.setValue(name, form.getValues(name), { shouldTouch: true });
    }
  }

  return (
    <FormProvider {...form}>
      <form className={createRoomFormClasses.root} onSubmit={submit} noValidate>
        <StepProgress step={step} total={FORM_STEPS.length} />
        {/* Every step stays mounted, so the tallest can set the box's height. */}
        <div ref={stepsRef} className={createRoomFormClasses.steps}>
          {FORM_STEPS.map(({ key }, at) => {
            const Body = STEP_BODIES[key];
            return (
              <StepBody key={key} stepKey={key} offset={at - step}>
                <Body />
              </StepBody>
            );
          })}
        </div>
        <ServerAlert />
        <FormActions
          isFirst={step === 0}
          isLast={isLast}
          isLoading={createRoom.isPending}
          onBack={() => setStep(step - 1)}
        />
      </form>
    </FormProvider>
  );
}

/**
 * The step a draft comes back on: the one it was left on, or an earlier one whose answers no longer
 * pass — so the host never lands past a question they have to answer again.
 */
function firstUnfinishedStep(values: CreateRoomInput, left: number) {
  const shape = CreateRoomInputSchema.shape;
  const last = Math.min(left, FORM_STEPS.length - 1);
  const at = FORM_STEPS.slice(0, last).findIndex((each) =>
    each.fields.some((name) => !shape[name].safeParse(values[name]).success),
  );
  return at === -1 ? last : at;
}

function initialValues(now: number, locale: Locale): CreateRoomInput {
  const closesAt = new Date(now);
  closesAt.setHours(closesAt.getHours() + DEFAULT_CLOSE_AFTER_HOURS, 0, 0, 0);
  return {
    hostName: "",
    hostGender: HOST_GENDERS.m,
    groupName: "",
    // No story until the host picks one: no one starts out "fired", and "Next" reads "Skip".
    reason: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    windowStart: toLocalDateInput(now),
    days: DEFAULT_DAYS,
    dayStartHour: DEFAULT_DAY_START_HOUR,
    dayEndHour: DEFAULT_DAY_END_HOUR,
    votingClosesAt: closesAt.toISOString(),
    locale,
  };
}
