"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { sheetClasses } from "./Sheet.classes";
import { SHEET_NAMESPACE, sheetKeys } from "./Sheet.keys.const";
import type { SheetProps } from "./Sheet.types";
import { useFocusTrap } from "./useFocusTrap";

const SPRING = { type: "spring", damping: 30, stiffness: 320 } as const;

const subscribeNothing = () => () => {};

/** A modal bottom sheet, portalled to `<body>`: focus-trapped, closed by Escape or the backdrop. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const t = useTranslations(SHEET_NAMESPACE);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const isClient = useSyncExternalStore(subscribeNothing, () => true, () => false);
  useFocusTrap(panelRef, open, onClose);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={sheetClasses.root}>
          <motion.div
            className={sheetClasses.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={sheetClasses.panel}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING}
          >
            <div className={sheetClasses.header}>
              <h2 id={titleId} className={sheetClasses.title}>
                {title}
              </h2>
              <Button
                variant={BUTTON_VARIANTS.ghost}
                size={BUTTON_SIZES.sm}
                icon={ICON_NAMES.close}
                aria-label={t(sheetKeys.close)}
                onClick={onClose}
              />
            </div>
            <div className={sheetClasses.body}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
