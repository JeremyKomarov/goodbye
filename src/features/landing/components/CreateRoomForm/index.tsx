"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import {
  CreateRoomInputSchema, HOST_GENDERS, LEAVE_REASONS, type CreateRoomInput,
} from "@/features/landing/api/rooms.dto";
import { useCreateRoom } from "@/features/landing/hooks/useCreateRoom";
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
  const [defaultValues] = useState(() => initialValues(Date.now()));
  const form = useForm<CreateRoomInput>({
    resolver: zodResolver(CreateRoomInputSchema),
    defaultValues,
    mode: "onTouched",
  });
  const createRoom = useCreateRoom();
  const [step, setStep] = useState(0);
  const isLast = step === FORM_STEPS.length - 1;
  const { key } = FORM_STEPS[step];
  const Body = STEP_BODIES[key];

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values: { reason, hostName, groupName } }) =>
          onPreview({ story: reason, hostName, groupName }),
      }),
    [form, onPreview],
  );

  function create(input: CreateRoomInput) {
    createRoom.mutate(input, {
      onSuccess: (room) => {
        saveAdminToken(room.slug, room.adminToken);
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    if (isLast) return form.handleSubmit(create)(event);
    event.preventDefault();
    if (await form.trigger(FORM_STEPS[step].fields)) setStep(step + 1);
  }

  return (
    <FormProvider {...form}>
      <form className={createRoomFormClasses.root} onSubmit={submit} noValidate>
        <StepProgress step={step} total={FORM_STEPS.length} />
        <AnimatePresence mode="wait" initial={false}>
          <StepBody key={key} stepKey={key}>
            <Body />
          </StepBody>
        </AnimatePresence>
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

function initialValues(now: number): CreateRoomInput {
  const closesAt = new Date(now);
  closesAt.setHours(closesAt.getHours() + DEFAULT_CLOSE_AFTER_HOURS, 0, 0, 0);
  return {
    hostName: "",
    hostGender: HOST_GENDERS.m,
    groupName: "",
    reason: LEAVE_REASONS.fired,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    windowStart: toLocalDateInput(now),
    days: DEFAULT_DAYS,
    dayStartHour: DEFAULT_DAY_START_HOUR,
    dayEndHour: DEFAULT_DAY_END_HOUR,
    votingClosesAt: closesAt.toISOString(),
  };
}
