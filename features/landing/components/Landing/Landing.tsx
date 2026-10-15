"use client";

import styles from "./Landing.module.scss";
import { CreateRoom } from "@/features/landing/components/CreateRoom/CreateRoom";
import { HeroChat } from "@/features/landing/components/HeroChat/HeroChat";
import { useLandingStore } from "@/features/landing/store/useLandingStore";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch/LanguageSwitch";
import { useLocale } from "@/core/i18n/useLocale";

// Headline, then the chat and the create form side by side on desktop (chat on
// the left, sticky), stacked on phones. The reason picked in the form steers the
// conversation.
export function Landing({ children }: { children: React.ReactNode }) {
  const reason = useLandingStore((state) => state.reason);
  const theme = useLandingStore((state) => state.theme);
  const draft = useLandingStore((state) => state.draft);
  const pick = useLandingStore((state) => state.pickReason);
  const setDraft = useLandingStore((state) => state.setDraft);
  const locale = useLocale((state) => state.locale);

  return (
    <main className={styles.view1}>
      <header className={styles.view2}>
        <LanguageSwitch />
        {children}
      </header>

      <div className={styles.view3}>
        <div className={styles.view4}>
          <HeroChat key={locale} theme={theme} draft={draft} />
        </div>
      </div>

      <div className={styles.view5}>
        <CreateRoom reason={reason} onReason={pick} onDraft={setDraft} />
      </div>
    </main>
  );
}
