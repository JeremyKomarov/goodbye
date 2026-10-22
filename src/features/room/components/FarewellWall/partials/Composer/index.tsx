import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import {
  MAX_WALL_MESSAGE, PostMessageInputSchema, type PostMessageInput,
} from "@/features/room/api/wall.dto";
import { useTypingSignal } from "@/features/room/hooks/useTypingSignal";
import { farewellWallClasses } from "@/features/room/components/FarewellWall/FarewellWall.classes";
import {
  FAREWELL_WALL_NAMESPACE, farewellWallKeys,
} from "@/features/room/components/FarewellWall/FarewellWall.keys.const";
import { Button, BUTTON_SIZES } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { ICON_NAMES } from "@/shared/components/Icon";

// The count of what is left appears this close to the limit.
const COUNT_FROM = 30;
const SEND_ERRORS = [API_ERROR_CODES.too_fast, API_ERROR_CODES.forbidden] as const;
type SendError = (typeof SEND_ERRORS)[number] | "failed";

interface ComposerProps {
  /** Rejects with an `ApiError` — `too_fast`, `forbidden`. */
  onSend: (input: PostMessageInput) => Promise<unknown>;
  /** "Is typing" on (true) and off, for everyone else's screen. */
  onTyping: (isTyping: boolean) => void;
  /** Above the field: the quick emoji. */
  children?: ReactNode;
}

/** The wall's composer: a goodbye of up to 140 characters, sent with the round button. */
export function Composer({ onSend, onTyping, children }: ComposerProps) {
  const t = useTranslations(FAREWELL_WALL_NAMESPACE);
  const form = useForm<PostMessageInput>({
    resolver: zodResolver(PostMessageInputSchema),
    defaultValues: { body: "" },
  });
  const body = useWatch({ control: form.control, name: "body" });
  const { errors, isSubmitting } = form.formState;
  const typing = useTypingSignal(onTyping);
  const field = form.register("body", {
    onChange: (event) => typing.onDraft(event.target.value),
    onBlur: typing.stop,
  });
  const left = MAX_WALL_MESSAGE - body.length;
  const serverType = errors.root?.server?.type as SendError | undefined;

  const submit = form.handleSubmit(async (input) => {
    try {
      await onSend(input);
      form.reset();
      typing.stop();
    } catch (error) {
      const code = error instanceof ApiError ? error.code : null;
      const known = SEND_ERRORS.find((candidate) => candidate === code);
      form.setError("root.server", { type: known ?? "failed" });
    }
  });

  return (
    <div className={farewellWallClasses.composer}>
      {children}
      {serverType && (
        <p role="alert" className={farewellWallClasses.error}>
          {t(farewellWallKeys.errors[serverType])}
        </p>
      )}
      <form className={farewellWallClasses.form} onSubmit={submit} noValidate>
        <div>
          <Field
            label={t(farewellWallKeys.composer.label)}
            isLabelHidden
            placeholder={t(farewellWallKeys.composer.label)}
            maxLength={MAX_WALL_MESSAGE}
            autoComplete="off"
            enterKeyHint="send"
            className={farewellWallClasses.input}
            {...field}
          />
          {left <= COUNT_FROM && <span className={farewellWallClasses.count}>{left}</span>}
        </div>
        <Button
          type="submit"
          size={BUTTON_SIZES.lg}
          icon={ICON_NAMES.send}
          aria-label={t(farewellWallKeys.composer.send)}
          isLoading={isSubmitting}
          disabled={!body.trim()}
        />
      </form>
    </div>
  );
}
