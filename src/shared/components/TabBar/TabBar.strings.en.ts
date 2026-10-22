import type { StringsOf } from "@/core/i18n/strings.types";
import type { tabBarStrings } from "./TabBar.strings";

export const tabBarStringsEn: StringsOf<typeof tabBarStrings> = {
  unread: "{count, plural, one {one new message} other {# new messages}}",
};
