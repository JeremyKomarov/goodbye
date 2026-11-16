import type { StringsOf } from "@/core/i18n/strings.types";
import type { createSuccessStrings } from "./CreateSuccess.strings";

export const createSuccessStringsEn: StringsOf<typeof createSuccessStrings> = {
  intro: "This is what the group gets. Democracy does the rest.",
  share: "Share to the WhatsApp group",
  roomLink: "Room link",
  adminTitle: "Your admin link. Just for you",
  adminWhy:
    "Only this link can close voting and mark your exit. Don't send it to the group. " +
    "This browser keeps it too, but save a copy.",
  enter: "Enter the room",
  invite: "{name} is leaving the group, and you decide when 🫡\nVote here: {url}",
};
