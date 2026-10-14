import type { ReactNode } from "react";

/** The small centered notice WhatsApp uses for "X left", "X joined", etc. */
export function SystemPill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-fit max-w-[90%] rounded-lg bg-raised/95 px-3 py-1.5 text-center text-[13px] leading-snug text-pill shadow-sm ${className}`}>
      {children}
    </div>
  );
}
