/** WhatsApp's blue double check. */
export function Ticks({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 11" className={`inline-block h-[11px] w-[18px] text-tick ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 6l3.5 3.5L11 1.5" />
      <path d="M7.5 9.5 8 10l7-8.5" />
    </svg>
  );
}
