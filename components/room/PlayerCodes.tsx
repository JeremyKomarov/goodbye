"use client";

import { useEffect, useState } from "react";
import { listPlayerCodes, type PlayerCode } from "@/app/r/[slug]/admin/actions";
import { codeMessage, whatsappLink } from "@/lib/share";

type Props = { slug: string; token: string };

/** The host's list of everyone's code, to send to whoever needs theirs on another device. */
export function PlayerCodes({ slug, token }: Props) {
  const [players, setPlayers] = useState<PlayerCode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [origin] = useState(() => window.location.origin);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listPlayerCodes(slug, token).then((result) => {
      if (cancelled) return;
      if (result.ok) setPlayers(result.players);
      else setError(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, token, version]);

  const url = `${origin}/r/${slug}`;

  return (
    <section className="rounded-3xl bg-panel p-5">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="font-semibold">
          קודים לכניסה
          {players && players.length > 0 && (
            <span className="ms-2 text-sm font-normal text-mute">
              {players.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={() => setVersion((v) => v + 1)}
          className="text-sm text-tick"
        >
          רענון
        </button>
      </div>
      <p className="mb-3 text-sm text-mute">
        מי שנכנס ממכשיר אחר כותב את השם שלו ואז את הקוד. שכחו? שולחים להם מכאן.
      </p>

      {error ? (
        <p className="text-sm text-exit">{error}</p>
      ) : players === null ? (
        <p className="text-mute">טוענים…</p>
      ) : players.length === 0 ? (
        <p className="text-mute">עוד אף אחד לא נכנס.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {players.map((p) => (
            <li
              key={p.userId}
              className="flex items-center gap-2 rounded-xl bg-raised py-2 pe-2 ps-3"
            >
              <span className="min-w-0 flex-1 truncate">
                <bdi>{p.name}</bdi>
              </span>
              {p.code ? (
                <>
                  <span
                    dir="ltr"
                    className="font-mono text-lg font-semibold tracking-[0.2em]"
                  >
                    {p.code}
                  </span>
                  <CopyButton text={p.code} />
                  <a
                    href={whatsappLink(codeMessage(p.name, p.code, url))}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`שליחת הקוד ל${p.name} בוואטסאפ`}
                    className="shrink-0 rounded-lg bg-signal px-3 py-2 text-sm font-semibold text-night"
                  >
                    שליחה
                  </a>
                </>
              ) : (
                <span className="text-xs text-mute">
                  הקוד ייווצר בכניסה הבאה לחדר
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
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
      {copied ? "הועתק" : "העתקה"}
    </button>
  );
}
