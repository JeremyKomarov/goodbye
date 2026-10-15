"use client";

import styles from "./CreateSuccess.module.scss";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { iso } from "@/core/hebrew";
import type { CreatedRoom } from "@/features/landing/types";
import { CopyButton } from "@/components/ui/CopyButton/CopyButton";
import { useTranslations } from "@/core/i18n/useLocale";

function CopyRow({
  value,
  label: text,
  tone = "ink",
}: {
  value: string;
  label: string;
  tone?: "ink" | "pill";
}) {
  return (
    <div>
      <div
        className={[styles.view44, tone === "pill" ? styles.view45 : styles.view38, ""].filter(Boolean).join(" ")}
      >
        {text}
      </div>
      <div className={styles.view46}>
        <span
          dir="ltr"
          className={styles.view47}
        >
          {value}
        </span>
        <CopyButton text={value} className={styles.view48} />
      </div>
    </div>
  );
}

export function CreateSuccess({ created }: { created: CreatedRoom }) {
  const t = useTranslations();
  const [origin] = useState(() => window.location.origin);
  const roomUrl = `${origin}/r/${created.slug}`;
  const adminUrl = `${roomUrl}/admin#k=${created.adminToken}`;
  const name = created.hostName;
  const shareText = t("shareInvite", { name: iso(name), leaving: t(created.gender === "m" ? "leavingMasculine" : "leavingFeminine"), url: roomUrl });

  return (
    <div className={styles.view49}>
      <div className={styles.view50}>
        <div className={styles.view51}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 14, stiffness: 260 }}
            className={styles.view52}
            aria-hidden
          >
            🗳️
          </motion.div>
          <p className={styles.view53}>
            {t("shareRoomIntro")}
          </p>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className={styles.view54}
        >
          {t("sendToWhatsapp")}
        </a>

        <CopyRow value={roomUrl} label={t("roomLink")} />
      </div>

      <div className={styles.view50}>
        <CopyRow
          value={adminUrl}
          label={t("adminLinkHelp")}
          tone="pill"
        />

        <Link
          href={`/r/${created.slug}`}
          className={styles.view55}
        >
          {t("enterRoom")}
        </Link>
      </div>
    </div>
  );
}
