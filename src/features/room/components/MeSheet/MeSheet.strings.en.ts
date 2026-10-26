import type { StringsOf } from "@/core/i18n/strings.types";
import type { meSheetStrings } from "./MeSheet.strings";

export const meSheetStringsEn: StringsOf<typeof meSheetStrings> = {
  title: "Hi {name}",
  rename: {
    label: "Your name in the room",
    save: "Save",
    note: "Messages already on the wall keep the old name.",
  },
  device: {
    title: "Join from another device",
    how:
      "On another phone or computer, open the room link, type {name}, then the code. " +
      "You pick up where you left off, with the same vote and the same scores.",
    show: "Show my code",
    fresh: "New code",
    confirmFresh:
      "Make a new code? The old one stops working, " +
      "and devices that joined with it will need the new one.",
  },
  notYou: {
    text: "Not {name}? On a shared phone you can come in under another name.",
    action: "Use another name",
    confirm: "Use another name? The room will forget {name} in this browser, in other rooms too.",
  },
  errors: {
    name: "A name is needed, up to 24 characters",
    name_taken: "That name is taken in the room. Maybe add a letter of your surname?",
    failed: "We couldn't change your name. Try again",
    code: "We couldn't make a code. Try again",
    codeLimited: "A lot of codes were made in the last hour. Try again later",
  },
};
