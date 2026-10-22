import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { HostGender } from "@/core/constants/room.const";
import { SignInAsInputSchema, type SignInAsInput } from "@/features/room/api/login-code.dto";
import { joinGateClasses } from "@/features/room/components/JoinGate/JoinGate.classes";
import {
  JOIN_GATE_NAMESPACE, joinGateKeys,
} from "@/features/room/components/JoinGate/JoinGate.keys.const";
import type { JoinGateProps } from "@/features/room/components/JoinGate/JoinGate.types";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { isolate } from "@/shared/utils/isolate";

const CODE_ERRORS = [
  API_ERROR_CODES.not_found,
  API_ERROR_CODES.wrong_login_code,
  API_ERROR_CODES.too_many_attempts,
] as const;
type CodeError = (typeof CODE_ERRORS)[number];

interface CodeFormProps {
  name: string;
  host: { name: string; gender: HostGender };
  onSignInAs: JoinGateProps["onSignInAs"];
  /** "That's not me": back to choosing a name. */
  onBack: () => void;
}

/** The name is taken — maybe by this person on another device. Their code brings them in. */
export function CodeForm({ name, host, onSignInAs, onBack }: CodeFormProps) {
  const t = useTranslations(JOIN_GATE_NAMESPACE);
  const form = useForm<SignInAsInput>({
    resolver: zodResolver(SignInAsInputSchema),
    defaultValues: { code: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const who = isolate(name);

  const submit = form.handleSubmit(async ({ code }) => {
    try {
      await onSignInAs(name, code);
    } catch (error) {
      const code = error instanceof ApiError ? error.code : null;
      const known = CODE_ERRORS.find((candidate) => candidate === code);
      form.setError("code", { type: known ?? "failed" }, { shouldFocus: true });
    }
  });

  const type = errors.code?.type;
  const codeError = !type
    ? undefined
    : CODE_ERRORS.includes(type as CodeError)
      ? t(joinGateKeys.errors[type as CodeError])
      : type === "failed"
        ? t(joinGateKeys.errors.failed)
        : t(joinGateKeys.errors.code);

  return (
    <form
      className={joinGateClasses.form}
      aria-label={t(joinGateKeys.label)}
      onSubmit={submit}
      noValidate
    >
      <p className={joinGateClasses.question}>{t(joinGateKeys.code.question, { name: who })}</p>
      <Field
        label={t(joinGateKeys.code.label, { name: who })}
        helper={t(joinGateKeys.code.helper, {
          name: who,
          host: isolate(host.name),
          gender: host.gender,
        })}
        error={codeError}
        className={joinGateClasses.code}
        maxLength={12}
        autoFocus
        autoCapitalize="characters"
        autoComplete="one-time-code"
        spellCheck={false}
        enterKeyHint="go"
        dir="ltr"
        {...form.register("code")}
      />
      <Button type="submit" size={BUTTON_SIZES.lg} fullWidth isLoading={isSubmitting}>
        {t(joinGateKeys.code.enter, { name: who })}
      </Button>
      <Button variant={BUTTON_VARIANTS.ghost} onClick={onBack}>
        {t(joinGateKeys.code.notMe)}
      </Button>
    </form>
  );
}
