import type { StringsOf } from "@/core/i18n/strings.types";
import type { featuresStrings } from "./features.strings";

export const featuresStringsEn: StringsOf<typeof featuresStrings> = {
  landing: { label: "Open a room", blurb: "Open a room and send the link to the group." },
  room: { label: "The room", blurb: "Vote on the hour to leave, write on the wall, say goodbye." },
  games: { label: "Games", blurb: "Small games while you wait for the hour." },
  admin: { label: "Room admin", blurb: "The host closes the vote, leaves the group and sends codes." },
};
