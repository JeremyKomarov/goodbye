import type { StringsOf } from "@/core/i18n/strings.types";
import type { errorScreenStrings } from "./ErrorScreen.strings";

export const errorScreenStringsEn: StringsOf<typeof errorScreenStrings> = {
  title: "Something went wrong",
  why: "This page got stuck. Try again — and if it keeps happening, go back to the home page.",
  retry: "Try again",
  home: "Go to the home page",
};
