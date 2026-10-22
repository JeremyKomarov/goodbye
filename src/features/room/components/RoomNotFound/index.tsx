import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/core/constants/routes.const";
import { SystemPill } from "@/shared/components/SystemPill";
import { roomNotFoundClasses } from "./RoomNotFound.classes";
import { ROOM_NOT_FOUND_NAMESPACE, roomNotFoundKeys } from "./RoomNotFound.keys.const";

/** A room link that leads nowhere: deleted by the nightly cleanup, or cut off when copied. */
export function RoomNotFound() {
  const t = useTranslations(ROOM_NOT_FOUND_NAMESPACE);

  return (
    <main className={roomNotFoundClasses.root}>
      <SystemPill>{t(roomNotFoundKeys.gone)}</SystemPill>
      <p className={roomNotFoundClasses.why}>{t(roomNotFoundKeys.why)}</p>
      <Link href={ROUTES.landing} className={roomNotFoundClasses.open}>
        {t(roomNotFoundKeys.open)}
      </Link>
    </main>
  );
}
