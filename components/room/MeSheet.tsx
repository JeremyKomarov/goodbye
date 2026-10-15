"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { iso } from "@/lib/hebrew";
import type { Me } from "@/lib/hooks/useRoom";

type Props = {
  me: Me;
  open: boolean;
  onClose: () => void;
  onRename: (name: string) => Promise<string | null>;
  onSwitch: () => Promise<void>;
};

/** Your name in the room: fix it, or hand the phone to someone else ("not you?"). */
export function MeSheet({ me, open, onClose, onRename, onSwitch }: Props) {
  return (
    <Sheet open={open} onClose={onClose} title={`שלום ${me.name}`}>
      <MeForm
        me={me}
        onClose={onClose}
        onRename={onRename}
        onSwitch={onSwitch}
      />
    </Sheet>
  );
}

function MeForm({ me, onClose, onRename, onSwitch }: Omit<Props, "open">) {
  const [name, setName] = useState(me.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const err = await onRename(name);
    setPending(false);
    if (err) setError(err);
    else onClose();
  }

  async function switchUser() {
    if (
      !window.confirm(
        `להיכנס בשם אחר? החדר ישכח את ${me.name} בדפדפן הזה, גם בחדרים אחרים.`,
      )
    )
      return;
    onClose();
    await onSwitch();
  }

  return (
    <div className="flex flex-col gap-5 pb-1">
      <form onSubmit={save}>
        <label htmlFor="me-name" className="mb-1.5 block text-sm text-mute">
          השם שלך בחדר
        </label>
        <div className="flex gap-2">
          <input
            id="me-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
            enterKeyHint="done"
            className="min-w-0 flex-1 rounded-xl bg-raised px-4 py-3 text-base outline-none focus:ring-2 focus:ring-pill/70"
          />
          <button
            type="submit"
            disabled={pending || !name.trim() || name.trim() === me.name}
            className="shrink-0 rounded-xl bg-signal px-5 font-semibold text-night disabled:opacity-50"
          >
            {pending ? "שומרים…" : "שמירה"}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-exit">
            {error}
          </p>
        )}
        <p className="mt-2 text-xs text-mute">
          הודעות שכבר נשלחו לקיר נשארות עם השם הקודם.
        </p>
      </form>

      <div className="border-t border-line/60 pt-4">
        <p className="text-sm text-ink/80">
          {`לא ${iso(me.name)}? בטלפון משותף אפשר להיכנס בשם אחר.`}
        </p>
        <button
          type="button"
          onClick={switchUser}
          className="mt-2 text-sm text-tick underline-offset-2 hover:underline"
        >
          להיכנס בשם אחר
        </button>
      </div>
    </div>
  );
}
