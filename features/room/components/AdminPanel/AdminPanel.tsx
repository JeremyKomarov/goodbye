"use client";

import styles from "./AdminPanel.module.scss";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { type AdminResult, getAdminRoom } from "@/app/r/[slug]/admin/actions";
import { AdminRoomPanel } from "@/features/room/components/AdminRoomPanel/AdminRoomPanel";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";
import { loadAdminToken, saveAdminToken } from "@/core/admin-storage";

const noop = () => () => {};

function readToken(slug: string) {
  const fromHash = new URLSearchParams(window.location.hash.slice(1)).get("k");
  if (fromHash) {
    saveAdminToken(slug, fromHash);
    return fromHash;
  }
  return loadAdminToken(slug) ?? "";
}

export function AdminPanel({ slug }: { slug: string }) {
  const token = useSyncExternalStore(
    noop,
    () => readToken(slug),
    () => null,
  );
  const [state, setState] = useState<AdminResult | null>(null);

  useEffect(() => {
    if (token === null) return;
    let cancelled = false;
    getAdminRoom(slug, token).then((result) => !cancelled && setState(result));
    return () => {
      cancelled = true;
    };
  }, [slug, token]);

  if (token === null || state === null)
    return (
      <p className={styles.view1}>בודקים את קישור הניהול…</p>
    );
  if (!state.ok)
    return (
      <main className={styles.view2}>
        <SystemPill className={styles.view3}>{state.error}</SystemPill>
        <Link href={`/r/${slug}`} className={styles.view4}>
          לחדר עצמו
        </Link>
      </main>
    );

  return (
    <AdminRoomPanel
      slug={slug}
      token={token}
      room={state.room}
      onRoom={(room) => setState({ ok: true, room })}
    />
  );
}
