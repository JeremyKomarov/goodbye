"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { translate, type Locale, type MessageKey } from "./messages";

const STORAGE_KEY = "exit-group-locale";

type LocaleState = { locale: Locale; setLocale: (locale: Locale) => void };

export const useLocale = create<LocaleState>((set) => ({
  locale: "he",
  setLocale: (locale) => set({ locale }),
}));

export function LocaleEffects() {
  const locale = useLocale((state) => state.locale);
  const setLocale = useLocale((state) => state.setLocale);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "he" || saved === "en") setLocale(saved);
  }, [setLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);
  return null;
}

export function useTranslations() {
  const locale = useLocale((state) => state.locale);
  return (key: MessageKey, values?: Record<string, string | number>) => translate(locale, key, values);
}

export function localize(key: MessageKey, values?: Record<string, string | number>) {
  return translate(useLocale.getState().locale, key, values);
}
