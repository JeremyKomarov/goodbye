import type { StringsOf } from "@/core/i18n/strings.types";
import type { createSuccessStrings } from "./CreateSuccess.strings";

export const createSuccessStringsEn: StringsOf<typeof createSuccessStrings> = {
  intro: "Share the link with the group. Everyone picks an hour, and democracy does the rest.",
  share: "Share to the WhatsApp group",
  roomLink: "Room link",
  adminLink:
    "Your admin link. Keep it safe: it lets you close voting and mark your exit. " +
    "Do not share it with the group.",
  enter: "Enter the room",
  invite: "{name} is leaving the group, and you decide when 🫡\nVote here: {url}",
};
