"use client";

import { useCallback, useState } from "react";
import { CreateRoomPanel } from "@/features/landing/components/CreateRoomPanel";
import { HeroChat } from "@/features/landing/components/HeroChat";
import type { ChatPreview } from "@/features/landing/types/wizard.types";
import { landingScreenClasses } from "./LandingScreen.classes";
import { INITIAL_CHAT } from "./LandingScreen.const";
import { Intro } from "./partials/Intro";

/** The home page: the headline, the group chat, and the wizard that steers it. */
export function LandingScreen() {
  const [chat, setChat] = useState(INITIAL_CHAT);
  // An unpicked story leaves the chat on the last one told.
  const showPreview = useCallback(
    ({ story, ...names }: ChatPreview) =>
      setChat((shown) => ({ ...names, story: story ?? shown.story })),
    [],
  );

  return (
    <main className={landingScreenClasses.root}>
      <div className={landingScreenClasses.intro}>
        <Intro />
      </div>
      <div className={landingScreenClasses.chat}>
        <HeroChat
          story={chat.story}
          hostName={chat.hostName}
          hostGender={chat.hostGender}
          groupName={chat.groupName}
        />
      </div>
      <div className={landingScreenClasses.panel}>
        <CreateRoomPanel onPreview={showPreview} />
      </div>
    </main>
  );
}
