import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import {
  MAX_PLAYER_NAME, SaveNameInputSchema, type SaveNameInput,
} from "@/features/room/api/players.dto";
import { meSheetClasses } from "@/features/room/components/MeSheet/MeSheet.classes";
import {
  ME_SHEET_NAMESPACE, meSheetKeys,
} from "@/features/room/components/MeSheet/MeSheet.keys.const";
import { Button } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";

interface RenameFormProps {
  name: string;
  /** Rejects with an `ApiError` — `name_taken` when someone has the name. */
  onRename: (input: SaveNameInput) => Promise<unknown>;
  onDone: () => void;
}

/** Fix your name. Someone else's, or the host's, is refused by the database. */
export function RenameForm({ name, onRename, onDone }: RenameFormProps) {
  const t = useTranslations(ME_SHEET_NAMESPACE);
  const form = useForm<SaveNameInput>({
    resolver: zodResolver(SaveNameInputSchema),
    defaultValues: { name },
  });
  const { errors, isSubmitting } = form.formState;
  const typed = useWatch({ control: form.control, name: "name" });
  const unchanged = typed.trim() === name;

  const submit = form.handleSubmit(async (input) => {
    try {
      await onRename(input);
      onDone();
    } catch (error) {
      const taken = error instanceof ApiError && error.code === API_ERROR_CODES.name_taken;
      form.setError("name", { type: taken ? API_ERROR_CODES.name_taken : "failed" });
    }
  });

  const type = errors.name?.type;
  const error = !type
    ? undefined
    : type === API_ERROR_CODES.name_taken
      ? t(meSheetKeys.errors.name_taken)
      : type === "failed"
        ? t(meSheetKeys.errors.failed)
        : t(meSheetKeys.errors.name);

  return (
    <form className={meSheetClasses.section} onSubmit={submit} noValidate>
      <div className={meSheetClasses.row}>
        <Field
          label={t(meSheetKeys.rename.label)}
          maxLength={MAX_PLAYER_NAME}
          autoComplete="nickname"
          enterKeyHint="done"
          error={error}
          {...form.register("name")}
        />
        <Button type="submit" isLoading={isSubmitting} disabled={unchanged}>
          {t(meSheetKeys.rename.save)}
        </Button>
      </div>
      <p className={meSheetClasses.text}>{t(meSheetKeys.rename.note)}</p>
    </form>
  );
}
