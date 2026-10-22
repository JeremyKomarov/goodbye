import { useTranslations } from "next-intl";
import { meSheetClasses } from "@/features/room/components/MeSheet/MeSheet.classes";
import {
  ME_SHEET_NAMESPACE, meSheetKeys,
} from "@/features/room/components/MeSheet/MeSheet.keys.const";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { isolate } from "@/shared/utils/isolate";

/** "Not you?": a shared phone, handed on. Forgets this player in this browser, after asking. */
export function NotYou({ name, onSwitch }: { name: string; onSwitch: () => void }) {
  const t = useTranslations(ME_SHEET_NAMESPACE);

  return (
    <section className={meSheetClasses.section}>
      <p className={meSheetClasses.text}>{t(meSheetKeys.notYou.text, { name: isolate(name) })}</p>
      <Button
        variant={BUTTON_VARIANTS.secondary}
        onClick={() => {
          if (window.confirm(t(meSheetKeys.notYou.confirm, { name }))) onSwitch();
        }}
      >
        {t(meSheetKeys.notYou.action)}
      </Button>
    </section>
  );
}
