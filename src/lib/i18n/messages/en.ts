import { CATEGORIES, FREQUENCY_OPTIONS } from "@/lib/questionnaire";
import type { Messages } from "../types";

function buildEnglishQuestionnaire(): Messages["questionnaire"] {
  const questionnaire: Messages["questionnaire"] = {};
  for (const cat of CATEGORIES) {
    questionnaire[cat.id] = {
      name: cat.name,
      questions: Object.fromEntries(
        cat.questions.map((q) => [q.id, q.text]),
      ),
    };
  }
  return questionnaire;
}

export const en: Messages = {
  lang: { translate: "Translate" },
  nav: { home: "Home", assessment: "Assessment" },
  footer: {
    rights: "All rights reserved to",
    tagline: "AcuActiv Medical Detoxification · Miami, FL ·",
  },
  home: {
    badge: "Medical Detoxification Program",
    title: "Discover Your Body's Toxic Burden",
    subtitle:
      "Professional symptom scoring, visual charts, and a personalized nutrition plan — guided by Dr. Shlomi Gavish DOM, AP.",
    features: [
      {
        title: "Emoji-Guided Assessment",
        description:
          "Rate each symptom with intuitive 😊→😢 faces — 63 questions across 8 body systems.",
      },
      {
        title: "Charts & Toxic Score",
        description:
          "Radar, pie, and bar charts plus your personalized toxic burden percentage.",
      },
      {
        title: "Diet & Detox Plan",
        description:
          "Custom eat/avoid lists, hydration tips, and foods targeted to your highest-burden systems.",
      },
    ],
    systemsTitle: "8 Body Systems Assessed",
    systemsSubtitle: "Complete evaluation across every major detox pathway.",
    questions: "Qs",
    cta: "Let's Get Started",
  },
  hero: {
    title: "Detox Challange",
    startTest: "Start Test",
    viewResults: "View previous results →",
    meta: "~15 min · 63 questions · 😊 to 😢",
    metaExtra: " · Charts & diet recommendations",
  },
  video: {
    badge: "Hydration & cleanse",
    title: "Flow with your body's natural detox",
    description:
      "Like cleansing water through every cell, the AcuActiv program helps flush toxins, restore balance, and guide you with emoji-based tracking, live charts, and a diet built for your results.",
    cta: "Begin your challenge",
  },
  challenge: {
    step1: "Step 1 of 2",
    personalTitle: "Personal Information",
    personalSubtitle: "Tell us about yourself before starting the detox assessment.",
    questionnaireTitle: "Detox Challenge Questionnaire",
    questionnaireSubtitle:
      "Pick the face that matches how often you feel this symptom 😊→😢",
    overallProgress: "Overall progress",
    back: "Back",
    next: "Next",
    reviewAnswers: "Review answers",
    reviewTitle: "Ready to submit?",
    reviewProgress: "You've answered {answered} of {total} questions.",
    answerMissed: "Answer missed question",
    answerMissedPlural: "Answer missed questions ({count})",
    reviewWarning:
      "Some questions are unanswered. Go back to complete them for the most accurate results.",
    goToFirstMissed: "Go to first missed question",
    backToQuestions: "Back to questions",
    submit: "Submit & view results",
    submitting: "Submitting…",
    categoryTest: "Test",
    startingSection: "Starting next section",
    questionsInSection: "questions in this section",
    tapHowYouFeel: "Tap how you feel",
    best: "😊 Best",
    severity: "symptom severity →",
    worst: "😢 Worst",
  },
  form: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    dateOfBirth: "Date of Birth",
    testDate: "Test Date",
    measurementSystem: "Measurement System",
    imperial: "U.S. (Imperial)",
    metric: "Metric",
    feet: "Feet",
    inches: "Inches",
    pounds: "Pounds",
    heightCm: "Height (cm)",
    weightKg: "Weight (kg)",
    continue: "Continue to Assessment",
    errors: {
      firstName: "First name is required",
      lastName: "Last name is required",
      email: "Valid email is required",
      phone: "Phone number is required",
      dateOfBirth: "Date of birth is required",
      testDate: "Test date is required",
    },
  },
  frequency: FREQUENCY_OPTIONS.map((o) => ({
    label: o.label,
    shortLabel: o.shortLabel,
  })),
  results: {
    noResults: "No results found",
    noResultsHint: "Complete the detox challenge to unlock charts and your diet plan.",
    startAssessment: "Start Assessment",
    reportTitle: "Detox Assessment Report",
    complete: "Assessment Complete",
    yourResults: "Your Detox Results",
    grandTotal: "Grand Total",
    toxicBurden: "Toxic Burden",
    low: "😊 Low",
    high: "😢 High",
    systemBreakdown: "System Breakdown",
    visualAnalytics: "📊 Visual Analytics",
    dietTitle: "🥗 Your Detox Diet & Recommendations",
    disclaimerTitle: "Medical disclaimer",
    disclaimer:
      "Diet suggestions are educational and do not replace care from Dr. Shlomi Gavish DOM, AP. Detox products require an established patient consultation.",
    home: "Home",
    savePdf: "Save / Print PDF",
    retake: "Retake",
  },
  toxicLevels: {
    low: "Low toxic burden",
    mild: "Mild toxic burden",
    moderate: "Moderate toxic burden",
    elevated: "Elevated toxic burden",
    high: "High toxic burden — consultation recommended",
  },
  categories: {
    emotions: "Emotions",
    skin: "Skin",
    ent: "Ear, Nose & Throat",
    brain: "Mind & Brain",
    digestive: "Digestive",
    kidney: "Kidney",
    joints: "Joints",
    metabolism: "Metabolism",
  },
  banners: {
    skin: "Skin clarity, rashes, and dermatologic signs",
    ent: "Ear, nose, throat, and respiratory symptoms",
    joints: "Joints, muscles, and mobility discomfort",
    kidney: "Urinary health and kidney-related symptoms",
    brain: "Focus, memory, sleep, and mental clarity",
    digestive: "Gut health, digestion, and food tolerance",
    emotions: "Mood, anxiety, and emotional wellness",
    metabolism: "Energy, weight, cravings, and metabolic balance",
    default: "Answer each symptom honestly",
  },
  questionnaire: buildEnglishQuestionnaire(),
};
