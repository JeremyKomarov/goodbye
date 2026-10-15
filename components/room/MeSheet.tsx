"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { iso } from "@/lib/hebrew";
import type { Me } from "@/lib/hooks/useRoom";
import { loadLoginCode } from "@/lib/login";

type Props = {
  me: Me;
  open: boolean;
  onClose: () => void;
  onRename: (name: string) => Promise<string | null>;
  onSwitch: () => Promise<void>;
  onLoginCode: (fresh?: boolean) => Promise<string | null>;
};

/**
 * You in the room: fix your name, get the code for coming in from another device,
 * or hand the phone to someone else ("not you?").
 */
export function MeSheet({
  me,
  open,
  onClose,
  onRename,
  onSwitch,
  onLoginCode,
}: Props) {
  return (
    <Sheet open={open} onClose={onClose} title={`שלום ${me.name}`}>
      <MeForm
        me={me}
        onClose={onClose}
        onRename={onRename}
        onSwitch={onSwitch}
        onLoginCode={onLoginCode}
      />
    </Sheet>
  );
}

function MeForm({
  me,
  onClose,
  onRename,
  onSwitch,
  onLoginCode,
}: Omit<Props, "open">) {
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

      <DeviceCode me={me} onLoginCode={onLoginCode} />

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

function DeviceCode({ me, onLoginCode }: Pick<Props, "me" | "onLoginCode">) {
  const [code, setCode] = useState(() => loadLoginCode(me.userId));
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function show(fresh: boolean) {
    if (
      fresh &&
      !window.confirm(
        "ליצור קוד חדש? הקוד הישן יפסיק לעבוד, ומכשירים אחרים שנכנסו איתו יצטרכו את החדש.",
      )
    )
      return;
    setPending(true);
    setFailed(false);
    const next = await onLoginCode(fresh);
    setPending(false);
    if (next) setCode(next);
    else setFailed(true);
  }

  async function copy() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="border-t border-line/60 pt-4">
      <p className="font-semibold">כניסה ממכשיר אחר</p>
      <p className="mt-1 text-sm text-ink/80">
        {`בטלפון או במחשב אחר פותחים את הקישור לחדר, כותבים ${iso(me.name)} ואז את הקוד. ממשיכים מאותו מקום, עם אותו קול ואותם שיאים.`}
      </p>
      {code ? (
        <>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-raised p-1.5 ps-4">
            <span
              dir="ltr"
              className="flex-1 font-mono text-2xl font-semibold tracking-[0.3em]"
            >
              {code}
            </span>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg bg-line px-3 py-2 text-sm"
            >
              {copied ? "הועתק" : "העתקה"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => show(true)}
            disabled={pending}
            className="mt-2 text-xs text-mute underline-offset-2 hover:text-ink hover:underline"
          >
            {pending ? "יוצרים…" : "קוד חדש"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => show(false)}
          disabled={pending}
          className="mt-3 w-full rounded-xl bg-raised px-4 py-3 font-semibold disabled:opacity-50"
        >
          {pending ? "יוצרים קוד…" : "הצגת הקוד שלי"}
        </button>
      )}
      {failed && (
        <p role="alert" className="mt-2 text-sm text-exit">
          לא הצלחנו ליצור קוד. נסו שוב
        </p>
      )}
    </div>
  );
}
