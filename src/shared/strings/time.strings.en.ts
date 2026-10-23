import type { StringsOf } from "@/core/i18n/strings.types";
import type { timeStrings } from "./time.strings";

export const timeStringsEn: StringsOf<typeof timeStrings> = {
  slot: "{day} at {time}",
  duration: {
    days: "{count, plural, one {a day} other {# days}}",
    hours: "{count, plural, one {an hour} other {# hours}}",
    minutes: "{count, plural, one {a minute} other {# minutes}}",
    pair: "{first} and {second}",
    underMinute: "less than a minute",
  },
};
