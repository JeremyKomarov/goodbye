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
  slot: "{day} at {time}",
  duration: {
    days: "{count, plural, one {a day} other {# days}}",
    hours: "{count, plural, one {an hour} other {# hours}}",
    minutes: "{count, plural, one {a minute} other {# minutes}}",
    pair: "{first} and {second}",
    underMinute: "less than a minute",
  },
};
