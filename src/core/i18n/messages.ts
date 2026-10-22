// Namespace → the strings file that owns it, once per locale (02-COMPONENTS.md §9,
// docs/DECISIONS.md #5). Nothing is authored here; this is the one file in core/ allowed to reach
// into features/. A namespace added to one locale and not the other is a type error below.
import { featuresStrings } from "@/core/config/features.strings";
import { featuresStringsEn } from "@/core/config/features.strings.en";
import { FEATURES_NAMESPACE } from "@/core/config/features.keys.const";
import { COMING_SOON_NAMESPACE } from "@/shared/components/ComingSoon/ComingSoon.keys.const";
import { comingSoonStrings } from "@/shared/components/ComingSoon/ComingSoon.strings";
import { comingSoonStringsEn } from "@/shared/components/ComingSoon/ComingSoon.strings.en";
import { BUTTON_NAMESPACE } from "@/shared/components/Button/Button.keys.const";
import { buttonStrings } from "@/shared/components/Button/Button.strings";
import { buttonStringsEn } from "@/shared/components/Button/Button.strings.en";
import { SHEET_NAMESPACE } from "@/shared/components/Sheet/Sheet.keys.const";
import { sheetStrings } from "@/shared/components/Sheet/Sheet.strings";
import { sheetStringsEn } from "@/shared/components/Sheet/Sheet.strings.en";
import { COPY_BUTTON_NAMESPACE } from "@/shared/components/CopyButton/CopyButton.keys.const";
import { copyButtonStrings } from "@/shared/components/CopyButton/CopyButton.strings";
import { copyButtonStringsEn } from "@/shared/components/CopyButton/CopyButton.strings.en";
import {
  LANGUAGE_SWITCH_NAMESPACE,
} from "@/shared/components/LanguageSwitch/LanguageSwitch.keys.const";
import { languageSwitchStrings } from "@/shared/components/LanguageSwitch/LanguageSwitch.strings";
import {
  languageSwitchStringsEn,
} from "@/shared/components/LanguageSwitch/LanguageSwitch.strings.en";
import { TAB_BAR_NAMESPACE } from "@/shared/components/TabBar/TabBar.keys.const";
import { tabBarStrings } from "@/shared/components/TabBar/TabBar.strings";
import { tabBarStringsEn } from "@/shared/components/TabBar/TabBar.strings.en";
import { HERO_CHAT_NAMESPACE } from "@/features/landing/components/HeroChat/HeroChat.keys.const";
import { heroChatStrings } from "@/features/landing/components/HeroChat/HeroChat.strings";
import { heroChatStringsEn } from "@/features/landing/components/HeroChat/HeroChat.strings.en";
import { LANDING_NAMESPACE } from "@/features/landing/strings/landing.keys.const";
import { landingStrings } from "@/features/landing/strings/landing.strings";
import { landingStringsEn } from "@/features/landing/strings/landing.strings.en";
import {
  REASON_STEP_NAMESPACE,
} from "@/features/landing/components/CreateRoomForm/partials/ReasonStep/ReasonStep.keys.const";
import {
  reasonStepStrings,
} from "@/features/landing/components/CreateRoomForm/partials/ReasonStep/ReasonStep.strings";
import {
  reasonStepStringsEn,
} from "@/features/landing/components/CreateRoomForm/partials/ReasonStep/ReasonStep.strings.en";
import {
  IDENTITY_STEP_NAMESPACE,
} from "@/features/landing/components/CreateRoomForm/partials/IdentityStep/IdentityStep.keys.const";
import {
  identityStepStrings,
} from "@/features/landing/components/CreateRoomForm/partials/IdentityStep/IdentityStep.strings";
import {
  identityStepStringsEn,
} from "@/features/landing/components/CreateRoomForm/partials/IdentityStep/IdentityStep.strings.en";
import {
  SCHEDULE_STEP_NAMESPACE,
} from "@/features/landing/components/CreateRoomForm/partials/ScheduleStep/ScheduleStep.keys.const";
import {
  scheduleStepStrings,
} from "@/features/landing/components/CreateRoomForm/partials/ScheduleStep/ScheduleStep.strings";
import {
  scheduleStepStringsEn,
} from "@/features/landing/components/CreateRoomForm/partials/ScheduleStep/ScheduleStep.strings.en";
import type { Locale } from "./routing";
import type { StringsOf } from "./strings.types";

const he = {
  [FEATURES_NAMESPACE]: featuresStrings,
  [COMING_SOON_NAMESPACE]: comingSoonStrings,
  [BUTTON_NAMESPACE]: buttonStrings,
  [SHEET_NAMESPACE]: sheetStrings,
  [COPY_BUTTON_NAMESPACE]: copyButtonStrings,
  [LANGUAGE_SWITCH_NAMESPACE]: languageSwitchStrings,
  [TAB_BAR_NAMESPACE]: tabBarStrings,
  [HERO_CHAT_NAMESPACE]: heroChatStrings,
  [LANDING_NAMESPACE]: landingStrings,
  [REASON_STEP_NAMESPACE]: reasonStepStrings,
  [IDENTITY_STEP_NAMESPACE]: identityStepStrings,
  [SCHEDULE_STEP_NAMESPACE]: scheduleStepStrings,
};

const en: StringsOf<typeof he> = {
  [FEATURES_NAMESPACE]: featuresStringsEn,
  [COMING_SOON_NAMESPACE]: comingSoonStringsEn,
  [BUTTON_NAMESPACE]: buttonStringsEn,
  [SHEET_NAMESPACE]: sheetStringsEn,
  [COPY_BUTTON_NAMESPACE]: copyButtonStringsEn,
  [LANGUAGE_SWITCH_NAMESPACE]: languageSwitchStringsEn,
  [TAB_BAR_NAMESPACE]: tabBarStringsEn,
  [HERO_CHAT_NAMESPACE]: heroChatStringsEn,
  [LANDING_NAMESPACE]: landingStringsEn,
  [REASON_STEP_NAMESPACE]: reasonStepStringsEn,
  [IDENTITY_STEP_NAMESPACE]: identityStepStringsEn,
  [SCHEDULE_STEP_NAMESPACE]: scheduleStepStringsEn,
};

export type Messages = typeof he;

export const messages: Record<Locale, Messages> = { he, en };
