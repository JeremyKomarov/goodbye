import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomHeaderStrings } from "./RoomHeader.strings";

export const roomHeaderStringsEn: StringsOf<typeof roomHeaderStrings> = {
  hello: "Hi {name}",
  rename: "Change your name",
  online: "{count, plural, =0 {Connecting…} one {one person here now} other {# here now}}",
  inDays: "{count, plural, one {1 day to go} other {# days to go}}",
};
