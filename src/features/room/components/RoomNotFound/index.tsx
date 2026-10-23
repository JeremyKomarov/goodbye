import { useTranslations } from "next-intl";
import { ROUTES } from "@/core/constants/routes.const";
import { NoticeScreen } from "@/shared/components/NoticeScreen";
import { ROOM_NOT_FOUND_NAMESPACE, roomNotFoundKeys } from "./RoomNotFound.keys.const";

/** A room link that leads nowhere: deleted by the nightly cleanup, or cut off when copied. */
export function RoomNotFound() {
  const t = useTranslations(ROOM_NOT_FOUND_NAMESPACE);

  return (
    <NoticeScreen
      title={t(roomNotFoundKeys.gone)}
      why={t(roomNotFoundKeys.why)}
      link={{ href: ROUTES.landing, label: t(roomNotFoundKeys.open) }}
    />
  );
}
