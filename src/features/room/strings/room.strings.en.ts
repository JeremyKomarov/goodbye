import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomStrings } from "./room.strings";

export const roomStringsEn: StringsOf<typeof roomStrings> = {
  reason:
    "{reason, select, " +
    "fired {got fired} " +
    "quit {quit} " +
    "other {is just fed up}}",
  votes: "{count, plural, =0 {no votes} one {one vote} other {# votes}}",
  people: "{count, plural, one {one person} other {# people}}",
};
