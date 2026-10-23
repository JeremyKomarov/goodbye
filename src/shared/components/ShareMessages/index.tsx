"use client";

import { useTranslations } from "next-intl";
import { CopyButton } from "@/shared/components/CopyButton";
import { Skeleton, SKELETON_SHAPES } from "@/shared/components/Skeleton";
import type { Room } from "@/shared/types/room.types";
import { whatsappLink } from "@/shared/utils/whatsapp";
import { shareMessagesClasses } from "./ShareMessages.classes";
import { SHARE_MESSAGES_NAMESPACE, shareMessagesKeys } from "./ShareMessages.keys.const";
import { useShareTexts } from "./useShareTexts";

/**
 * The host's messages to the group, ready to send on WhatsApp or copy: the decision while the hour
 * is ahead, and the goodbye with the room's numbers and champions. WhatsApp can't pick the chat,
 * so the host does.
 */
export function ShareMessages({ room, url }: { room: Room; url: string }) {
  const t = useTranslations(SHARE_MESSAGES_NAMESPACE);
  const texts = useShareTexts(room, url);

  if (!texts)
    return (
      <div
        className={shareMessagesClasses.root}
        aria-busy
        aria-label={t(shareMessagesKeys.loading)}
      >
        <Skeleton shape={SKELETON_SHAPES.block} height="10rem" />
      </div>
    );

  return (
    <div className={shareMessagesClasses.root}>
      {texts.map((message) => (
        <section key={message.id} className={shareMessagesClasses.card}>
          <div className={shareMessagesClasses.head}>
            <h3 className={shareMessagesClasses.title}>{message.title}</h3>
            <span className={shareMessagesClasses.when}>{message.when}</span>
          </div>
          <p dir="auto" className={shareMessagesClasses.text}>
            {message.text}
          </p>
          <div className={shareMessagesClasses.actions}>
            <a
              href={whatsappLink(message.text)}
              target="_blank"
              rel="noreferrer"
              className={shareMessagesClasses.send}
            >
              {t(shareMessagesKeys.send)}
            </a>
            <CopyButton text={message.text} />
          </div>
        </section>
      ))}
      <p className={shareMessagesClasses.hint}>{t(shareMessagesKeys.hint)}</p>
    </div>
  );
}
