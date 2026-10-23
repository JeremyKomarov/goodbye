"use client";

import { useTranslations } from "next-intl";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import { ShareMessages } from "@/shared/components/ShareMessages";
import type { Room } from "@/shared/types/room.types";
import { groupMessagesClasses } from "./GroupMessages.classes";

/** The host's messages to the group — the same the room's sheet holds — on the admin page. */
export function GroupMessages({ room, roomUrl }: { room: Room; roomUrl: string }) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const isExited = room.status === ROOM_STATUSES.exited;

  return (
    <section className={groupMessagesClasses.root}>
      <h2 className={groupMessagesClasses.title}>
        {t(isExited ? adminKeys.share.exited : adminKeys.share.title)}
      </h2>
      <ShareMessages room={room} url={roomUrl} />
    </section>
  );
}
