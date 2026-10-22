import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import {
  MAX_PLAYER_NAME, SaveNameInputSchema, type SaveNameInput,
} from "@/features/room/api/players.dto";
import { joinGateClasses } from "@/features/room/components/JoinGate/JoinGate.classes";
import {
  JOIN_GATE_NAMESPACE, joinGateKeys,
} from "@/features/room/components/JoinGate/JoinGate.keys.const";
import type { JoinGateProps } from "@/features/room/components/JoinGate/JoinGate.types";
import { sameName } from "@/features/room/utils/names";
import { Button, BUTTON_SIZES } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { isolate } from "@/shared/utils/isolate";

const SERVER_ERROR = "root.server";
const HOST_NAME = "hostName";

interface NameFormProps {
  hostName: string;
  defaultName: string;
  onJoin: JoinGateProps["onJoin"];
  /** Someone in the room has the name: maybe this person, on another device. */
  onTaken: (name: string) => void;
}

/** "What's your name?" A taken name asks for that player's code; the host's name says whose. */
export function NameForm({ hostName, defaultName, onJoin, onTaken }: NameFormProps) {
  const t = useTranslations(JOIN_GATE_NAMESPACE);
  const form = useForm<SaveNameInput>({
    resolver: zodResolver(SaveNameInputSchema),
    defaultValues: { name: defaultName },
    mode: "onTouched",
  });
  const { errors, isSubmitting } = form.formState;

  const submit = form.handleSubmit(async (input) => {
    try {
      await onJoin(input);
    } catch (error) {
      if (!(error instanceof ApiError) || error.code !== API_ERROR_CODES.name_taken)
        return form.setError(SERVER_ERROR, { type: "failed" });
      if (sameName(input.name, hostName))
        return form.setError("name", { type: HOST_NAME }, { shouldFocus: true });
      onTaken(input.name.trim());
    }
  });

  const nameError = !errors.name
    ? undefined
    : errors.name.type === HOST_NAME
      ? t(joinGateKeys.errors.hostName, { host: isolate(hostName) })
      : t(joinGateKeys.errors.name);

  return (
    <form
      className={joinGateClasses.form}
      aria-label={t(joinGateKeys.label)}
      onSubmit={submit}
      noValidate
    >
      <Field
        label={t(joinGateKeys.nameLabel)}
        maxLength={MAX_PLAYER_NAME}
        autoComplete="nickname"
        enterKeyHint="go"
        autoFocus
        error={nameError}
        {...form.register("name")}
      />
      {errors.root?.server && (
        <p role="alert" className={joinGateClasses.alert}>
          {t(joinGateKeys.errors.failed)}
        </p>
      )}
      <Button type="submit" size={BUTTON_SIZES.lg} fullWidth isLoading={isSubmitting}>
        {t(joinGateKeys.enter)}
      </Button>
    </form>
  );
}
