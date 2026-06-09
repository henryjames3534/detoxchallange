"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <LanguageSwitcher />
    </LanguageProvider>
  );
}
