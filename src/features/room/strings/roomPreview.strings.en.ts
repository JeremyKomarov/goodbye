import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomPreviewStrings } from "./roomPreview.strings";

export const roomPreviewStringsEn: StringsOf<typeof roomPreviewStrings> = {
  title: {
    voting: "When does {name} leave {group}?",
    locked: "{name} leaves {group} {slot}",
    exited: "{name} left {group}: {verdict}",
    notFound: "Room not found",
  },
  description: {
    voting: "You decide. Come in, pick an hour, and play while you wait.",
    locked: "The group decided. Come for the countdown and the farewell wall.",
    exited: "That's it, it happened. The wall is still open.",
  },
  card: {
    voting: {
      pill: "You decide. Come in and vote",
      first: "When does {name}",
      second: "leave {group}?",
    },
    locked: {
      pill: "The group decided",
      first: "{name} leaves",
      second: "{day} at {time}",
    },
    exited: {
      pill: "{name} left {group}",
      first: "Bye {name}",
    },
  },
};
