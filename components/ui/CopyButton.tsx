"use client";

import { useState } from "react";

/** A small "copy" button that says "copied" for a moment. */
export function CopyButton({
  text,
  label = "העתקה",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="shrink-0 rounded-lg bg-line px-3 py-2 text-sm"
    >
      {copied ? "הועתק" : label}
    </button>
  );
}
