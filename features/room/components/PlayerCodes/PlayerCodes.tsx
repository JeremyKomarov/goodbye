"use client";

import styles from "./PlayerCodes.module.scss";
import { useEffect, useState } from "react";
import { listPlayerCodes, type PlayerCode } from "@/app/r/[slug]/admin/actions";
import { CopyButton } from "@/components/ui/CopyButton/CopyButton";
import { codeMessage, whatsappLink } from "@/core/share";

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
    <section className={styles.view1}>
      <div className={styles.view2}>
        <h2 className={styles.view3}>
          קודים לכניסה
          {players && players.length > 0 && (
            <span className={styles.view4}>
              {players.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={() => setVersion((v) => v + 1)}
          className={styles.view5}
        >
          רענון
        </button>
      </div>
      <p className={styles.view6}>
        מי שנכנס ממכשיר אחר כותב את השם שלו ואז את הקוד. שכחו? שולחים להם מכאן.
      </p>

      {error ? (
        <p className={styles.view7}>{error}</p>
      ) : players === null ? (
        <p className={styles.view8}>טוענים…</p>
      ) : players.length === 0 ? (
        <p className={styles.view8}>עוד אף אחד לא נכנס.</p>
      ) : (
        <ul className={styles.view9}>
          {players.map((p) => (
            <li
              key={p.userId}
              className={styles.view10}
            >
              <span className={styles.view11}>
                <bdi>{p.name}</bdi>
              </span>
              {p.code ? (
                <>
                  <span
                    dir="ltr"
                    className={styles.view12}
                  >
                    {p.code}
                  </span>
                  <CopyButton text={p.code} />
                  <a
                    href={whatsappLink(codeMessage(p.name, p.code, url))}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`שליחת הקוד ל${p.name} בוואטסאפ`}
                    className={styles.view13}
                  >
                    שליחה
                  </a>
                </>
              ) : (
                <span className={styles.view14}>
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
