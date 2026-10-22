import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomHeaderStrings } from "./RoomHeader.strings";

export const roomHeaderStringsEn: StringsOf<typeof roomHeaderStrings> = {
  hello: "Hi {name}",
  rename: "Change your name",
  inRoom: "{count, plural, one {one person in the room} other {# in the room}}",
};
