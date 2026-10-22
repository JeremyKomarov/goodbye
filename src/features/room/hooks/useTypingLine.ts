import { useTranslations } from "next-intl";
import type { RoomPeer } from "@/core/supabase/realtime";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import { isolate } from "@/shared/utils/isolate";

/** "Dana is typing…", "3 people are typing…", or null when nobody is. */
export function useTypingLine(typers: readonly RoomPeer[]): string | null {
  const t = useTranslations(ROOM_NAMESPACE);
  if (typers.length === 0) return null;
  return t(roomKeys.typing, { count: typers.length, name: isolate(typers[0].name) });
}
