import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "@/core/api/api-error";
import {
  adminControlsClasses,
} from "@/features/admin/components/AdminControls/AdminControls.classes";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import { ADMIN_ACTIONS, type AdminActionInput } from "@/shared/api/admin-action.dto";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { fromLocalDateTimeInput, toLocalDateTimeInput } from "@/shared/utils/localDateTime";

// The field holds the browser's local time; the reopen action carries it as an ISO instant. The
// rules on it (in the future, an hour left after it) are the handler's, read back on the field.
const ReopenFormSchema = z.object({ closesAt: z.string().min(1) });
type ReopenForm = z.infer<typeof ReopenFormSchema>;

const FIELD_ERRORS = ["close_time_in_past", "no_slots_after_close"] as const;
const HOUR_MS = 3_600_000;

interface ReopenFormProps {
  isVoting: boolean;
  votingClosesAt: number;
  onAct: (input: AdminActionInput) => Promise<unknown>;
}

/** Move the vote's close, or open the vote again after it locked. */
export function ReopenForm({ isVoting, votingClosesAt, onAct }: ReopenFormProps) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const [defaultCloses] = useState(() =>
    toLocalDateTimeInput(Math.max(Date.now() + HOUR_MS, votingClosesAt)),
  );
  const form = useForm<ReopenForm>({
    resolver: zodResolver(ReopenFormSchema),
    defaultValues: { closesAt: defaultCloses },
  });
  const { errors, isSubmitting } = form.formState;
  const type = errors.closesAt?.type;
  const known = FIELD_ERRORS.find((candidate) => candidate === type);

  const submit = form.handleSubmit(async ({ closesAt }) => {
    try {
      const votingClosesAt = fromLocalDateTimeInput(closesAt);
      await onAct({ action: ADMIN_ACTIONS.reopen, votingClosesAt });
    } catch (error) {
      const code = error instanceof ApiError ? error.code : null;
      const field = FIELD_ERRORS.find((candidate) => candidate === code);
      form.setError("closesAt", { type: field ?? "failed" });
    }
  });

  return (
    <form className={adminControlsClasses.row} onSubmit={submit} noValidate>
      <Field
        type="datetime-local"
        label={t(adminKeys.reopen.label, { isVoting: String(isVoting) })}
        error={type && t(adminKeys.errors[known ?? "failed"])}
        {...form.register("closesAt")}
      />
      <Button type="submit" variant={BUTTON_VARIANTS.secondary} isLoading={isSubmitting}>
        {t(adminKeys.reopen.action, { isVoting: String(isVoting) })}
      </Button>
    </form>
  );
}
