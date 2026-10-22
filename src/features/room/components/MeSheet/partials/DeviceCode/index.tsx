import { useTranslations } from "next-intl";
import { useState } from "react";
import { meSheetClasses } from "@/features/room/components/MeSheet/MeSheet.classes";
import {
  ME_SHEET_NAMESPACE, meSheetKeys,
} from "@/features/room/components/MeSheet/MeSheet.keys.const";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { CopyButton } from "@/shared/components/CopyButton";
import { isolate } from "@/shared/utils/isolate";
import { loadLoginCode } from "@/shared/utils/loginCodes";

interface DeviceCodeProps {
  me: { userId: string; name: string };
  /** The code — a new one with `fresh`. Rejects when it can't be made. */
  onLoginCode: (fresh: boolean) => Promise<string>;
}

/** Your code for coming in as yourself on another device: show it, copy it, or replace it. */
export function DeviceCode({ me, onLoginCode }: DeviceCodeProps) {
  const t = useTranslations(ME_SHEET_NAMESPACE);
  const [code, setCode] = useState(() => loadLoginCode(me.userId));
  const [isPending, setIsPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function show(fresh: boolean) {
    if (fresh && !window.confirm(t(meSheetKeys.device.confirmFresh))) return;
    setIsPending(true);
    setFailed(false);
    try {
      setCode(await onLoginCode(fresh));
    } catch {
      setFailed(true);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className={meSheetClasses.section}>
      <h3 className={meSheetClasses.heading}>{t(meSheetKeys.device.title)}</h3>
      <p className={meSheetClasses.text}>
        {t(meSheetKeys.device.how, { name: isolate(me.name) })}
      </p>
      {code ? (
        <>
          <div className={meSheetClasses.row}>
            <span className={meSheetClasses.code} dir="ltr">
              {code}
            </span>
            <CopyButton text={code} />
          </div>
          <Button variant={BUTTON_VARIANTS.ghost} isLoading={isPending} onClick={() => show(true)}>
            {t(meSheetKeys.device.fresh)}
          </Button>
        </>
      ) : (
        <Button isLoading={isPending} onClick={() => show(false)}>
          {t(meSheetKeys.device.show)}
        </Button>
      )}
      {failed && (
        <p role="alert" className={meSheetClasses.alert}>
          {t(meSheetKeys.errors.code)}
        </p>
      )}
    </section>
  );
}
