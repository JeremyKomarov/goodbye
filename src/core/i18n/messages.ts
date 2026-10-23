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
import {
  CREATE_SUCCESS_NAMESPACE,
} from "@/features/landing/components/CreateSuccess/CreateSuccess.keys.const";
import {
  createSuccessStrings,
} from "@/features/landing/components/CreateSuccess/CreateSuccess.strings";
import {
  createSuccessStringsEn,
} from "@/features/landing/components/CreateSuccess/CreateSuccess.strings.en";
import {
  INTRO_NAMESPACE,
} from "@/features/landing/components/LandingScreen/partials/Intro/Intro.keys.const";
import {
  introStrings,
} from "@/features/landing/components/LandingScreen/partials/Intro/Intro.strings";
import {
  introStringsEn,
} from "@/features/landing/components/LandingScreen/partials/Intro/Intro.strings.en";
import {
  CREATE_ROOM_PANEL_NAMESPACE,
} from "@/features/landing/components/CreateRoomPanel/CreateRoomPanel.keys.const";
import {
  createRoomPanelStrings,
} from "@/features/landing/components/CreateRoomPanel/CreateRoomPanel.strings";
import {
  createRoomPanelStringsEn,
} from "@/features/landing/components/CreateRoomPanel/CreateRoomPanel.strings.en";
import { ROOM_NAMESPACE } from "@/features/room/strings/room.keys.const";
import { roomStrings } from "@/features/room/strings/room.strings";
import { roomStringsEn } from "@/features/room/strings/room.strings.en";
import { JOIN_GATE_NAMESPACE } from "@/features/room/components/JoinGate/JoinGate.keys.const";
import { joinGateStrings } from "@/features/room/components/JoinGate/JoinGate.strings";
import { joinGateStringsEn } from "@/features/room/components/JoinGate/JoinGate.strings.en";
import { WELCOME_NAMESPACE } from "@/features/room/components/Welcome/Welcome.keys.const";
import { welcomeStrings } from "@/features/room/components/Welcome/Welcome.strings";
import { welcomeStringsEn } from "@/features/room/components/Welcome/Welcome.strings.en";
import { ROOM_HEADER_NAMESPACE } from "@/features/room/components/RoomHeader/RoomHeader.keys.const";
import { roomHeaderStrings } from "@/features/room/components/RoomHeader/RoomHeader.strings";
import { roomHeaderStringsEn } from "@/features/room/components/RoomHeader/RoomHeader.strings.en";
import {
  ROOM_SKELETON_NAMESPACE,
} from "@/features/room/components/RoomSkeleton/RoomSkeleton.keys.const";
import { roomSkeletonStrings } from "@/features/room/components/RoomSkeleton/RoomSkeleton.strings";
import {
  roomSkeletonStringsEn,
} from "@/features/room/components/RoomSkeleton/RoomSkeleton.strings.en";
import {
  ROOM_NOT_FOUND_NAMESPACE,
} from "@/features/room/components/RoomNotFound/RoomNotFound.keys.const";
import { roomNotFoundStrings } from "@/features/room/components/RoomNotFound/RoomNotFound.strings";
import {
  roomNotFoundStringsEn,
} from "@/features/room/components/RoomNotFound/RoomNotFound.strings.en";
import { VOTE_LEGEND_NAMESPACE } from "@/features/room/components/VoteLegend/VoteLegend.keys.const";
import { voteLegendStrings } from "@/features/room/components/VoteLegend/VoteLegend.strings";
import { voteLegendStringsEn } from "@/features/room/components/VoteLegend/VoteLegend.strings.en";
import {
  VOTE_HEATMAP_NAMESPACE,
} from "@/features/room/components/VoteHeatmap/VoteHeatmap.keys.const";
import { voteHeatmapStrings } from "@/features/room/components/VoteHeatmap/VoteHeatmap.strings";
import {
  voteHeatmapStringsEn,
} from "@/features/room/components/VoteHeatmap/VoteHeatmap.strings.en";
import { HERO_NAMESPACE } from "@/features/room/components/Hero/Hero.keys.const";
import { heroStrings } from "@/features/room/components/Hero/Hero.strings";
import { heroStringsEn } from "@/features/room/components/Hero/Hero.strings.en";
import { ME_SHEET_NAMESPACE } from "@/features/room/components/MeSheet/MeSheet.keys.const";
import { meSheetStrings } from "@/features/room/components/MeSheet/MeSheet.strings";
import { meSheetStringsEn } from "@/features/room/components/MeSheet/MeSheet.strings.en";
import {
  MESSAGE_BUBBLE_NAMESPACE,
} from "@/features/room/components/MessageBubble/MessageBubble.keys.const";
import {
  messageBubbleStrings,
} from "@/features/room/components/MessageBubble/MessageBubble.strings";
import {
  messageBubbleStringsEn,
} from "@/features/room/components/MessageBubble/MessageBubble.strings.en";
import {
  FAREWELL_WALL_NAMESPACE,
} from "@/features/room/components/FarewellWall/FarewellWall.keys.const";
import { farewellWallStrings } from "@/features/room/components/FarewellWall/FarewellWall.strings";
import {
  farewellWallStringsEn,
} from "@/features/room/components/FarewellWall/FarewellWall.strings.en";
import { ROOM_NAV_NAMESPACE } from "@/features/room/components/RoomNav/RoomNav.keys.const";
import { roomNavStrings } from "@/features/room/components/RoomNav/RoomNav.strings";
import { roomNavStringsEn } from "@/features/room/components/RoomNav/RoomNav.strings.en";
import {
  STATUS_STORIES_NAMESPACE,
} from "@/features/room/components/StatusStories/StatusStories.keys.const";
import {
  statusStoriesStrings,
} from "@/features/room/components/StatusStories/StatusStories.strings";
import {
  statusStoriesStringsEn,
} from "@/features/room/components/StatusStories/StatusStories.strings.en";
import { TIME_NAMESPACE } from "@/shared/strings/time.keys.const";
import { timeStrings } from "@/shared/strings/time.strings";
import { timeStringsEn } from "@/shared/strings/time.strings.en";
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
  [CREATE_SUCCESS_NAMESPACE]: createSuccessStrings,
  [INTRO_NAMESPACE]: introStrings,
  [CREATE_ROOM_PANEL_NAMESPACE]: createRoomPanelStrings,
  [REASON_STEP_NAMESPACE]: reasonStepStrings,
  [IDENTITY_STEP_NAMESPACE]: identityStepStrings,
  [SCHEDULE_STEP_NAMESPACE]: scheduleStepStrings,
  [ROOM_NAMESPACE]: roomStrings,
  [JOIN_GATE_NAMESPACE]: joinGateStrings,
  [WELCOME_NAMESPACE]: welcomeStrings,
  [ROOM_HEADER_NAMESPACE]: roomHeaderStrings,
  [ROOM_SKELETON_NAMESPACE]: roomSkeletonStrings,
  [ROOM_NOT_FOUND_NAMESPACE]: roomNotFoundStrings,
  [VOTE_LEGEND_NAMESPACE]: voteLegendStrings,
  [VOTE_HEATMAP_NAMESPACE]: voteHeatmapStrings,
  [HERO_NAMESPACE]: heroStrings,
  [ME_SHEET_NAMESPACE]: meSheetStrings,
  [MESSAGE_BUBBLE_NAMESPACE]: messageBubbleStrings,
  [FAREWELL_WALL_NAMESPACE]: farewellWallStrings,
  [ROOM_NAV_NAMESPACE]: roomNavStrings,
  [STATUS_STORIES_NAMESPACE]: statusStoriesStrings,
  [TIME_NAMESPACE]: timeStrings,
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
  [CREATE_SUCCESS_NAMESPACE]: createSuccessStringsEn,
  [INTRO_NAMESPACE]: introStringsEn,
  [CREATE_ROOM_PANEL_NAMESPACE]: createRoomPanelStringsEn,
  [REASON_STEP_NAMESPACE]: reasonStepStringsEn,
  [IDENTITY_STEP_NAMESPACE]: identityStepStringsEn,
  [SCHEDULE_STEP_NAMESPACE]: scheduleStepStringsEn,
  [ROOM_NAMESPACE]: roomStringsEn,
  [JOIN_GATE_NAMESPACE]: joinGateStringsEn,
  [WELCOME_NAMESPACE]: welcomeStringsEn,
  [ROOM_HEADER_NAMESPACE]: roomHeaderStringsEn,
  [ROOM_SKELETON_NAMESPACE]: roomSkeletonStringsEn,
  [ROOM_NOT_FOUND_NAMESPACE]: roomNotFoundStringsEn,
  [VOTE_LEGEND_NAMESPACE]: voteLegendStringsEn,
  [VOTE_HEATMAP_NAMESPACE]: voteHeatmapStringsEn,
  [HERO_NAMESPACE]: heroStringsEn,
  [ME_SHEET_NAMESPACE]: meSheetStringsEn,
  [MESSAGE_BUBBLE_NAMESPACE]: messageBubbleStringsEn,
  [FAREWELL_WALL_NAMESPACE]: farewellWallStringsEn,
  [ROOM_NAV_NAMESPACE]: roomNavStringsEn,
  [STATUS_STORIES_NAMESPACE]: statusStoriesStringsEn,
  [TIME_NAMESPACE]: timeStringsEn,
};

export type Messages = typeof he;

export const messages: Record<Locale, Messages> = { he, en };
