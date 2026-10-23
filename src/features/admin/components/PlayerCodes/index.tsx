"use client";

import { useTranslations } from "next-intl";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import type { AdminPlayer } from "@/features/admin/types/admin.types";
import { CopyButton } from "@/shared/components/CopyButton";
import { isolate } from "@/shared/utils/isolate";
import { whatsappLink } from "@/shared/utils/whatsapp";
import { playerCodesClasses } from "./PlayerCodes.classes";

/** Every player's code, for whoever lost theirs on another device. The host has the admin link. */
export function PlayerCodes({ players, roomUrl }: { players: AdminPlayer[]; roomUrl: string }) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const guests = players.filter((player) => !player.isHost);

  return (
    <section className={playerCodesClasses.root}>
      <h2 className={playerCodesClasses.title}>{t(adminKeys.codes.title)}</h2>
      <p className={playerCodesClasses.help}>
        {guests.length ? t(adminKeys.codes.help) : t(adminKeys.codes.empty)}
      </p>
      {guests.length > 0 && (
        <ul className={playerCodesClasses.list}>
          {guests.map((player) => {
            const name = isolate(player.name);
            return (
              <li key={player.userId} className={playerCodesClasses.item}>
                <span className={playerCodesClasses.name}>
                  <bdi>{player.name}</bdi>
                </span>
                {player.code ? (
                  <>
                    <span dir="ltr" className={playerCodesClasses.code}>
                      {player.code}
                    </span>
                    <CopyButton text={player.code} />
                    <a
                      href={whatsappLink(
                        t(adminKeys.codes.message, { name, code: player.code, url: roomUrl }),
                      )}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t(adminKeys.codes.sendTo, { name })}
                      className={playerCodesClasses.send}
                    >
                      {t(adminKeys.codes.send)}
                    </a>
                  </>
                ) : (
                  <span className={playerCodesClasses.pending}>{t(adminKeys.codes.pending)}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
