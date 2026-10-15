"use client";

import styles from "./CopyButton.module.scss";
import { useState } from "react";
import { useTranslations } from "@/core/i18n/useLocale";

/** A small "copy" button that says "copied" for a moment. */
export function CopyButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations();
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={[styles.view1, className].filter(Boolean).join(" ")}
    >
      {copied ? t("copied") : label ?? t("copy")}
    </button>
  );
}
