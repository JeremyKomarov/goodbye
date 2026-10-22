"use client";

import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { CreateRoomForm } from "@/features/landing/components/CreateRoomForm";
import { CreateSuccess } from "@/features/landing/components/CreateSuccess";
import type { ChatPreview, OpenedRoom } from "@/features/landing/types/wizard.types";
import { Skeleton, SKELETON_SHAPES } from "@/shared/components/Skeleton";
import { createRoomPanelClasses } from "./CreateRoomPanel.classes";
import { CREATE_ROOM_PANEL_NAMESPACE, createRoomPanelKeys } from "./CreateRoomPanel.keys.const";

const noSubscription = () => () => {};

/**
 * The card holding the wizard, then the room it opened. The wizard's defaults come from the
 * visitor's clock and timezone, so until the page runs in the browser this is a placeholder.
 */
export function CreateRoomPanel({ onPreview }: { onPreview: (preview: ChatPreview) => void }) {
  const t = useTranslations(CREATE_ROOM_PANEL_NAMESPACE);
  const [opened, setOpened] = useState<OpenedRoom | null>(null);
  const isBrowser = useSyncExternalStore(noSubscription, () => true, () => false);
  const label = t(opened ? createRoomPanelKeys.ready : createRoomPanelKeys.newRoom);

  return (
    <section className={createRoomPanelClasses.root} aria-label={label} aria-busy={!isBrowser}>
      {opened ? (
        <>
          <h2 className={createRoomPanelClasses.heading}>{label}</h2>
          <CreateSuccess opened={opened} />
        </>
      ) : isBrowser ? (
        <CreateRoomForm onCreated={setOpened} onPreview={onPreview} />
      ) : (
        <Skeleton shape={SKELETON_SHAPES.block} height="27rem" />
      )}
    </section>
  );
}
