"use client";

import { useTranslations } from "next-intl";
import type { SaveNameInput } from "@/features/room/api/players.dto";
import type { Player } from "@/features/room/types/room.types";
import { Sheet } from "@/shared/components/Sheet";
import { meSheetClasses } from "./MeSheet.classes";
import { ME_SHEET_NAMESPACE, meSheetKeys } from "./MeSheet.keys.const";
import { DeviceCode } from "./partials/DeviceCode";
import { NotYou } from "./partials/NotYou";
import { RenameForm } from "./partials/RenameForm";

interface MeSheetProps {
  me: Player;
  open: boolean;
  onClose: () => void;
  onRename: (input: SaveNameInput) => Promise<unknown>;
  onLoginCode: (fresh: boolean) => Promise<string>;
  onSwitch: () => void;
}

/**
 * You in the room: fix your name, get the code for coming in from another device, or hand the
 * phone to someone else. Opened from "Hi {name}" in the header; not offered to the host.
 */
export function MeSheet({ me, open, onClose, onRename, onLoginCode, onSwitch }: MeSheetProps) {
  const t = useTranslations(ME_SHEET_NAMESPACE);

  return (
    <Sheet open={open} onClose={onClose} title={t(meSheetKeys.title, { name: me.name })}>
      <div className={meSheetClasses.root}>
        <RenameForm key={me.name} name={me.name} onRename={onRename} onDone={onClose} />
        <DeviceCode me={me} onLoginCode={onLoginCode} />
        <NotYou
          name={me.name}
          onSwitch={() => {
            onClose();
            onSwitch();
          }}
        />
      </div>
    </Sheet>
  );
}
