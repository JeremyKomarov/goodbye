import { useTranslations } from "next-intl";
import { LanguageSwitch } from "@/shared/components/LanguageSwitch";
import { introClasses } from "./Intro.classes";
import { INTRO_NAMESPACE, introKeys } from "./Intro.keys.const";

/** The language switch, the headline, and a line on what the app does. */
export function Intro() {
  const t = useTranslations(INTRO_NAMESPACE);

  return (
    <header className={introClasses.root}>
      <LanguageSwitch />
      <h1 className={introClasses.title}>
        {t(introKeys.titleFirst)}
        <br />
        {t(introKeys.titleSecond)}
      </h1>
      <p className={introClasses.description}>{t(introKeys.description)}</p>
    </header>
  );
}
