"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CATEGORIES, FREQUENCY_OPTIONS } from "@/lib/questionnaire";
import type { Category } from "@/lib/types";
import { getToxicLevelLabel } from "@/lib/scoring";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { ht } from "./messages/ht";
import type { Locale, Messages } from "./types";
import { LOCALES } from "./types";

const STORAGE_KEY = "acuactiv-locale";

const allMessages: Record<Locale, Messages> = { en, es, ht };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  categories: Category[];
  frequencyOptions: typeof FREQUENCY_OPTIONS;
  getCategoryTestLabel: (categoryId: string) => string;
  getToxicLabel: (percent: number) => string;
  getCategoryName: (categoryId: string, fallback?: string) => string;
  getBannerSubtitle: (categoryId: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function buildCategories(locale: Locale): Category[] {
  const messages = allMessages[locale];
  return CATEGORIES.map((cat) => {
    const translated = messages.questionnaire[cat.id];
    if (!translated) return cat;
    return {
      ...cat,
      name: translated.name,
      questions: cat.questions.map((q) => ({
        ...q,
        text: translated.questions[q.id] ?? q.text,
      })),
    };
  });
}

function buildFrequencyOptions(locale: Locale) {
  const labels = allMessages[locale].frequency;
  return FREQUENCY_OPTIONS.map((opt, i) => ({
    ...opt,
    label: labels[i]?.label ?? opt.label,
    shortLabel: labels[i]?.shortLabel ?? opt.shortLabel,
  }));
}

function toxicLabelForPercent(locale: Locale, percent: number): string {
  const levels = allMessages[locale].toxicLevels;
  if (percent < 15) return levels.low;
  if (percent < 30) return levels.mild;
  if (percent < 50) return levels.moderate;
  if (percent < 70) return levels.elevated;
  return levels.high;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && LOCALES.includes(saved)) {
      setLocaleState(saved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "ht" ? "ht" : locale;
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const t = allMessages[locale];
    return {
      locale,
      setLocale,
      t,
      categories: buildCategories(locale),
      frequencyOptions: buildFrequencyOptions(locale),
      getCategoryTestLabel: (categoryId: string) => {
        const name =
          t.questionnaire[categoryId]?.name ??
          t.categories[categoryId] ??
          categoryId;
        return `${name} ${t.challenge.categoryTest}`;
      },
      getToxicLabel: (percent: number) =>
        locale === "en"
          ? getToxicLevelLabel(percent)
          : toxicLabelForPercent(locale, percent),
      getCategoryName: (categoryId: string, fallback?: string) =>
        t.questionnaire[categoryId]?.name ??
        t.categories[categoryId] ??
        fallback ??
        categoryId,
      getBannerSubtitle: (categoryId: string) =>
        t.banners[categoryId] ??
        t.banners.default ??
        "Answer each symptom honestly",
    };
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
