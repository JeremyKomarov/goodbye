"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import type { AdminMessage } from "@/features/admin/types/admin.types";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { adminWallClasses } from "./AdminWall.classes";

interface AdminWallProps {
  /** Newest first. */
  messages: AdminMessage[];
  onRefresh: () => void;
  onDelete: (messageId: number) => void;
  isBusy: boolean;
}

/** The newest goodbyes, to take one down that shouldn't be there. It asks first. */
export function AdminWall({ messages, onRefresh, onDelete, isBusy }: AdminWallProps) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const titleId = useId();

  return (
    <section className={adminWallClasses.root} aria-labelledby={titleId}>
      <div className={adminWallClasses.head}>
        <h2 id={titleId} className={adminWallClasses.title}>
          {t(adminKeys.wall.title)}
          {messages.length > 0 && (
            <span className={adminWallClasses.count}>{messages.length}</span>
          )}
        </h2>
        <Button variant={BUTTON_VARIANTS.ghost} size={BUTTON_SIZES.sm} onClick={onRefresh}>
          {t(adminKeys.wall.refresh)}
        </Button>
      </div>
      {messages.length === 0 ? (
        <p className={adminWallClasses.empty}>{t(adminKeys.wall.empty)}</p>
      ) : (
        <ul className={adminWallClasses.list}>
          {messages.map((message) => (
            <li key={message.id} className={adminWallClasses.item}>
              <div className={adminWallClasses.text}>
                <div className={adminWallClasses.name}>
                  <bdi>{message.name}</bdi>
                </div>
                <p dir="auto" className={adminWallClasses.body}>
                  {message.body}
                </p>
              </div>
              <Button
                variant={BUTTON_VARIANTS.danger}
                size={BUTTON_SIZES.sm}
                disabled={isBusy}
                onClick={() => window.confirm(t(adminKeys.wall.ask)) && onDelete(message.id)}
              >
                {t(adminKeys.wall.delete)}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
