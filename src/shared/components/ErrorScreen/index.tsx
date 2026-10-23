"use client";

import { useTranslations } from "next-intl";
import { ROUTES } from "@/core/constants/routes.const";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { NoticeScreen } from "@/shared/components/NoticeScreen";
import { ERROR_SCREEN_NAMESPACE, errorScreenKeys } from "./ErrorScreen.keys.const";

/** The props Next gives an `error.tsx` or `global-error.tsx`. */
export interface ErrorScreenProps {
  error: unknown;
  /** Re-fetches and re-renders the segment that threw. */
  retry: () => void;
}

/** A page that threw while rendering: say so, offer it again, and a way home. */
export function ErrorScreen({ retry }: ErrorScreenProps) {
  const t = useTranslations(ERROR_SCREEN_NAMESPACE);

  return (
    <NoticeScreen
      title={t(errorScreenKeys.title)}
      why={t(errorScreenKeys.why)}
      link={{ href: ROUTES.landing, label: t(errorScreenKeys.home) }}
      action={
        <Button variant={BUTTON_VARIANTS.secondary} size={BUTTON_SIZES.lg} onClick={retry}>
          {t(errorScreenKeys.retry)}
        </Button>
      }
    />
  );
}
