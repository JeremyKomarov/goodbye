import type { StringsOf } from "@/core/i18n/strings.types";
import type { reasonStepStrings } from "./ReasonStep.strings";

export const reasonStepStringsEn: StringsOf<typeof reasonStepStrings> = {
  label: "Why leave?",
  reasons: {
    fired: { label: "I was fired", tagline: "They'll miss me" },
    quit: { label: "I resigned", tagline: "Leaving with my head high" },
    fed_up: { label: "I've had enough", tagline: "I live for drama" },
  },
};
