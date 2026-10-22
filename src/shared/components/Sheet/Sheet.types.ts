import type { ReactNode } from "react";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Already translated; the heading and the dialog's accessible name. */
  title: ReactNode;
  children: ReactNode;
}
