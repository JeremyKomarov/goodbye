"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ADMIN_TOKEN_PARAM, roomPath } from "@/core/constants/routes.const";
import type { OpenedRoom } from "@/features/landing/types/wizard.types";
import { cn } from "@/shared/utils/cn";
import { isolate } from "@/shared/utils/isolate";
import { createSuccessClasses } from "./CreateSuccess.classes";
import { WHATSAPP_SHARE_URL } from "./CreateSuccess.const";
import { CREATE_SUCCESS_NAMESPACE, createSuccessKeys } from "./CreateSuccess.keys.const";
import { LINK_ROW_TONES, LinkRow } from "./partials/LinkRow";

/**
 * The room is open: send the link to the group, copy it, keep the admin link, go in. The admin
 * link is the only time the token is shown; it is also kept in this browser.
 */
export function CreateSuccess({ opened }: { opened: OpenedRoom }) {
  const t = useTranslations(CREATE_SUCCESS_NAMESPACE);
  const { room, hostName, hostGender } = opened;
  const [origin] = useState(() => window.location.origin);
  const roomUrl = `${origin}${roomPath(FEATURE_KEYS.room, room.slug)}`;
  const adminUrl =
    `${origin}${roomPath(FEATURE_KEYS.admin, room.slug)}#${ADMIN_TOKEN_PARAM}=${room.adminToken}`;
  const invite = t(createSuccessKeys.invite, {
    name: isolate(hostName),
    gender: hostGender,
    url: roomUrl,
  });

  return (
    <div className={createSuccessClasses.root}>
      <div className={createSuccessClasses.section}>
        <div className={createSuccessClasses.intro}>
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 14, stiffness: 260 }}
            className={createSuccessClasses.ballot}
            aria-hidden
          >
            🗳️
          </motion.span>
          <p>{t(createSuccessKeys.intro)}</p>
        </div>
        <a
          href={`${WHATSAPP_SHARE_URL}?text=${encodeURIComponent(invite)}`}
          target="_blank"
          rel="noreferrer"
          className={cn(createSuccessClasses.action, createSuccessClasses.share)}
        >
          {t(createSuccessKeys.share)}
        </a>
        <LinkRow label={t(createSuccessKeys.roomLink)} url={roomUrl} />
      </div>

      <div className={createSuccessClasses.section}>
        <LinkRow
          label={t(createSuccessKeys.adminLink)}
          url={adminUrl}
          tone={LINK_ROW_TONES.secret}
        />
        <Link
          href={roomPath(FEATURE_KEYS.room, room.slug)}
          className={cn(createSuccessClasses.action, createSuccessClasses.enter)}
        >
          {t(createSuccessKeys.enter)}
        </Link>
      </div>
    </div>
  );
}
