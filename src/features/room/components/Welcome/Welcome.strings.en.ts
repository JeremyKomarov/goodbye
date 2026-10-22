import type { StringsOf } from "@/core/i18n/strings.types";
import type { welcomeStrings } from "./Welcome.strings";

export const welcomeStringsEn: StringsOf<typeof welcomeStrings> = {
  hello:
    "{returning, select, " +
    "true {Welcome back, {name} 👋} " +
    "other {Hi {name} 👋 the room will remember you}}",
};
