export type Locale = "en" | "es" | "ht";

export const LOCALES: Locale[] = ["en", "es", "ht"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ht: "Kreyòl Ayisyen",
};

export interface CategoryTranslation {
  name: string;
  questions: Record<string, string>;
}

export interface Messages {
  lang: {
    translate: string;
  };
  nav: {
    home: string;
    assessment: string;
  };
  footer: {
    rights: string;
    tagline: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    features: { title: string; description: string }[];
    systemsTitle: string;
    systemsSubtitle: string;
    questions: string;
    cta: string;
  };
  hero: {
    title: string;
    startTest: string;
    viewResults: string;
    meta: string;
    metaExtra: string;
  };
  video: {
    badge: string;
    title: string;
    description: string;
    cta: string;
  };
  challenge: {
    step1: string;
    personalTitle: string;
    personalSubtitle: string;
    questionnaireTitle: string;
    questionnaireSubtitle: string;
    overallProgress: string;
    back: string;
    next: string;
    reviewAnswers: string;
    reviewTitle: string;
    reviewProgress: string;
    answerMissed: string;
    answerMissedPlural: string;
    reviewWarning: string;
    goToFirstMissed: string;
    backToQuestions: string;
    submit: string;
    submitting: string;
    categoryTest: string;
    startingSection: string;
    questionsInSection: string;
    tapHowYouFeel: string;
    best: string;
    severity: string;
    worst: string;
  };
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    testDate: string;
    measurementSystem: string;
    imperial: string;
    metric: string;
    feet: string;
    inches: string;
    pounds: string;
    heightCm: string;
    weightKg: string;
    continue: string;
    errors: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: string;
      testDate: string;
    };
  };
  frequency: {
    label: string;
    shortLabel: string;
  }[];
  results: {
    noResults: string;
    noResultsHint: string;
    startAssessment: string;
    reportTitle: string;
    complete: string;
    yourResults: string;
    grandTotal: string;
    toxicBurden: string;
    low: string;
    high: string;
    systemBreakdown: string;
    visualAnalytics: string;
    dietTitle: string;
    disclaimerTitle: string;
    disclaimer: string;
    home: string;
    savePdf: string;
    retake: string;
  };
  toxicLevels: {
    low: string;
    mild: string;
    moderate: string;
    elevated: string;
    high: string;
  };
  categories: Record<string, string>;
  banners: Record<string, string>;
  questionnaire: Record<string, CategoryTranslation>;
}
