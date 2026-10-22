import type { StringsOf } from "@/core/i18n/strings.types";
import type { messageBubbleStrings } from "./MessageBubble.strings";

export const messageBubbleStringsEn: StringsOf<typeof messageBubbleStrings> = {
  hostBadge: "leaving",
  react: "React to this message",
  chip: "{emoji} {count}{mine, select, true {, including yours} other {}}",
};
