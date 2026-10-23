"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { roomPath } from "@/core/constants/routes.const";
import { AdminControls } from "@/features/admin/components/AdminControls";
import { useAdminAction } from "@/features/admin/hooks/useAdminAction";
import { useAdminRoom } from "@/features/admin/hooks/useAdminRoom";
import { useLinkToken } from "@/features/admin/hooks/useLinkToken";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import { Skeleton, SKELETON_SHAPES } from "@/shared/components/Skeleton";
import { SystemPill } from "@/shared/components/SystemPill";
import { adminScreenClasses } from "./AdminScreen.classes";

/**
 * The host's page, opened from the admin link. The token proves it: without it — or with a wrong
 * one — the page says so and links back to the room.
 */
export function AdminScreen({ slug }: { slug: string }) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const token = useLinkToken(slug);
  const admin = useAdminRoom(slug, token || null);
  const action = useAdminAction(slug, token ?? "");
  const roomHref = roomPath(FEATURE_KEYS.room, slug);

  const code = admin.error instanceof ApiError ? admin.error.code : null;
  const isRefused =
    token === "" || code === API_ERROR_CODES.forbidden || code === API_ERROR_CODES.not_found;

  let body: ReactNode;
  if (isRefused || admin.isError) {
    body = (
      <div className={adminScreenClasses.message}>
        <SystemPill>{t(isRefused ? adminKeys.denied : adminKeys.failed)}</SystemPill>
      </div>
    );
  } else if (!admin.data) {
    body = (
      <div className={adminScreenClasses.grid} aria-busy aria-label={t(adminKeys.checking)}>
        <Skeleton shape={SKELETON_SHAPES.block} height="20rem" />
        <Skeleton shape={SKELETON_SHAPES.block} height="20rem" />
      </div>
    );
  } else {
    body = (
      <div className={adminScreenClasses.grid}>
        <div className={adminScreenClasses.column}>
          <AdminControls room={admin.data.room} onAct={action.mutateAsync} />
        </div>
        <div className={adminScreenClasses.column} />
      </div>
    );
  }

  return (
    <main className={adminScreenClasses.root}>
      <header className={adminScreenClasses.head}>
        <Link href={roomHref} className={adminScreenClasses.back}>
          {t(adminKeys.back)}
        </Link>
        <h1 className={adminScreenClasses.title}>{t(adminKeys.title)}</h1>
        {admin.data && (
          <p className={adminScreenClasses.group}>
            <bdi>{admin.data.room.groupName}</bdi>
          </p>
        )}
        <p className={adminScreenClasses.private}>{t(adminKeys.private)}</p>
      </header>
      {body}
    </main>
  );
}
