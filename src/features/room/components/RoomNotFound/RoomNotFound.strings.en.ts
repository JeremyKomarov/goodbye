import type { StringsOf } from "@/core/i18n/strings.types";
import type { roomNotFoundStrings } from "./RoomNotFound.strings";

export const roomNotFoundStringsEn: StringsOf<typeof roomNotFoundStrings> = {
  gone: "This link doesn't work anymore",
  why: "There's no room at this address. Maybe the link got cut off when it was copied?",
  open: "Open a new room",
};
