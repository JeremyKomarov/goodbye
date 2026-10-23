import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomHeaderStrings } from "./RoomHeader.strings";

export const roomHeaderStringsEn: StringsOf<typeof roomHeaderStrings> = {
  hello: "Hi {name}",
  rename: "Change your name",
  party: "Rain 🎉 on everyone in the room",
  admin: "Manage the room (only you see this)",
  adminTitle: "Manage the room. Only you see this, because you opened the room in this browser",
  online: "{count, plural, =0 {Connecting…} one {one person here now} other {# here now}}",
  inDays: "{count, plural, one {1 day to go} other {# days to go}}",
};
