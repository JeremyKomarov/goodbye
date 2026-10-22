import type { StringsOf } from "@/core/i18n/strings.types";
import type { identityStepStrings } from "./IdentityStep.strings";

export const identityStepStringsEn: StringsOf<typeof identityStepStrings> = {
  hostName: "What's your name?",
  hostNamePlaceholder: "Jeremy",
  groupName: "Which group are you leaving?",
  groupNamePlaceholder: "Product team 🚀",
  genderLabel: "How should we refer to you?",
  genders: { m: "He/him", f: "She/her" },
  preview: "{name} left the group",
};
