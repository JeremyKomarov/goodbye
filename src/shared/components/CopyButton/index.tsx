"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS, type ButtonSize } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { copyButtonClasses } from "./CopyButton.classes";
import { COPY_BUTTON_NAMESPACE, copyButtonKeys } from "./CopyButton.keys.const";

const COPIED_FOR_MS = 1600;

/** Copies `text`, then says so for a moment. `label` replaces "Copy" — already translated. */
export function CopyButton({
  text,
  label,
  size = BUTTON_SIZES.sm,
}: {
  text: string;
  label?: ReactNode;
  size?: ButtonSize;
}) {
  const t = useTranslations(COPY_BUTTON_NAMESPACE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_FOR_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <Button
      variant={BUTTON_VARIANTS.secondary}
      size={size}
      icon={copied ? ICON_NAMES.check : ICON_NAMES.copy}
      className={cn(copyButtonClasses.root, copied && copyButtonClasses.copied)}
      onClick={copy}
    >
      <span aria-live="polite">
        {copied ? t(copyButtonKeys.copied) : (label ?? t(copyButtonKeys.copy))}
      </span>
    </Button>
  );
}
