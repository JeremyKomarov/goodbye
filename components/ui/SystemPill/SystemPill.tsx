import styles from "./SystemPill.module.scss";
import type { ReactNode } from "react";

/** The small centered notice WhatsApp uses for "X left", "X joined", etc. */
export function SystemPill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={[styles.view1, className, ""].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
