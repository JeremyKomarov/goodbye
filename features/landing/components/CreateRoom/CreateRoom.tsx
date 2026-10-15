"use client";

import styles from "./CreateRoom.module.scss";
import { useState, useSyncExternalStore } from "react";
import { CreateSuccess } from "@/features/landing/components/CreateSuccess/CreateSuccess";
import { CreateForm } from "@/features/landing/components/CreateForm/CreateForm";
import type { CreatedRoom, Draft } from "@/features/landing/types";
import { useTranslations } from "@/core/i18n/useLocale";
import type { Reason } from "@/core/types";

const noop = () => () => {};

/** The create-room form, always on the landing page. */
export function CreateRoom({
  reason,
  onReason,
  onDraft,
}: {
  reason: Reason | null;
  onReason: (r: Reason | null) => void;
  /** Called as the names are typed, so the chat preview can use them. */
  onDraft: (d: Draft) => void;
}) {
  const t = useTranslations();
  const [created, setCreated] = useState<CreatedRoom | null>(null);
  // The form's defaults come from the visitor's clock and time zone, so it
  // renders only in the browser.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  return (
    <section
      aria-label={created ? t("roomReady") : t("newRoom")}
      className={styles.view1}
    >
      {created ? (
        <>
          <h2 className={styles.view2}>
            {t("roomReady")}
          </h2>
          <CreateSuccess created={created} />
        </>
      ) : mounted ? (
        <CreateForm
          onCreated={setCreated}
          reason={reason}
          onReason={onReason}
          onDraft={onDraft}
        />
      ) : (
        <div className={styles.view3} aria-hidden />
      )}
    </section>
  );
}
