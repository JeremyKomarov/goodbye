import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomNavStrings } from "./RoomNav.strings";

export const roomNavStringsEn: StringsOf<typeof roomNavStrings> = {
  label: "Room sections",
  vote: {
    title: "Vote",
    left: "{name} left the group",
    chosen: "{drawn, select, true {Drawn} other {Chosen}}: {slot}",
    tie: "⚖️ A tie between {count} hours",
    leading: "Leading: {slot}",
    none: "Nobody has voted yet",
    voted: "{count} voted",
  },
  wall: {
    title: "Farewell wall",
    last: "{name}: {body}",
    none: "No goodbyes yet",
  },
};
