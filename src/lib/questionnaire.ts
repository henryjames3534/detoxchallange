import type { Category, SymptomFrequency } from "./types";

export const FREQUENCY_OPTIONS: {
  value: SymptomFrequency;
  label: string;
  shortLabel: string;
  emoji: string;
}[] = [
  {
    value: 0,
    label: "Never or almost never have the symptom",
    shortLabel: "Never",
    emoji: "😊",
  },
  {
    value: 1,
    label: "Occasionally have it",
    shortLabel: "Sometimes",
    emoji: "🙂",
  },
  {
    value: 2,
    label: "Occasionally have it, effect is severe",
    shortLabel: "Sometimes (bad)",
    emoji: "😐",
  },
  {
    value: 3,
    label: "Frequently have it, effect is not severe",
    shortLabel: "Often",
    emoji: "😟",
  },
  {
    value: 4,
    label: "Frequently have it, effect is severe",
    shortLabel: "Often (severe)",
    emoji: "😢",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "emotions",
    name: "Emotions",
    maxScore: 40,
    questions: [
      { id: "e1", text: "Irritability?" },
      { id: "e2", text: "Nervousness?" },
      { id: "e3", text: "Mood swings?" },
      { id: "e4", text: "Frequent crying?" },
      { id: "e5", text: "Aggressive behavior (e.g., road rage)?" },
      { id: "e6", text: "Anxiety?" },
      { id: "e7", text: "Fear?" },
      { id: "e8", text: "Confusion?" },
      { id: "e9", text: "Depression?" },
      { id: "e10", text: "Suicidal thoughts?" },
    ],
  },
  {
    id: "skin",
    name: "Skin",
    maxScore: 36,
    questions: [
      { id: "s1", text: "Increased sweating, ear wax, or oily skin?" },
      { id: "s2", text: "Skin rashes?" },
      { id: "s3", text: "Brown spots on hands and face?" },
      { id: "s4", text: "Boils?" },
      { id: "s5", text: "Skin tags (small hanging warts)?" },
      { id: "s6", text: "Acne?" },
      { id: "s7", text: "Eczema?" },
      { id: "s8", text: "Fever blisters?" },
      { id: "s9", text: "Warts?" },
    ],
  },
  {
    id: "ent",
    name: "Ear, Nose & Throat",
    maxScore: 36,
    questions: [
      { id: "ent1", text: "Increased salivation?" },
      { id: "ent2", text: "Mouth ulcers?" },
      { id: "ent3", text: "Common cold?" },
      { id: "ent4", text: "Sinusitis?" },
      { id: "ent5", text: "Sore throats?" },
      { id: "ent6", text: "Ear infections?" },
      { id: "ent7", text: "Hay fever?" },
      { id: "ent8", text: "Loss of smell?" },
      { id: "ent9", text: "Cough?" },
    ],
  },
  {
    id: "brain",
    name: "Mind & Brain",
    maxScore: 40,
    questions: [
      { id: "b1", text: "Hyperactivity?" },
      { id: "b2", text: "Stammering or difficulty finding words?" },
      { id: "b3", text: "Difficulty concentrating?" },
      { id: "b4", text: "Difficulty making decisions?" },
      { id: "b5", text: "Headache?" },
      { id: "b6", text: "Poor memory?" },
      { id: "b7", text: "Poor coordination?" },
      { id: "b8", text: "Compulsive behavior?" },
      { id: "b9", text: "Sleep disturbance?" },
      { id: "b10", text: "Memory loss?" },
    ],
  },
  {
    id: "digestive",
    name: "Digestive System",
    maxScore: 36,
    questions: [
      { id: "d1", text: "Loose stools?" },
      { id: "d2", text: "Diarrhea?" },
      { id: "d3", text: "Heartburn?" },
      { id: "d4", text: "Constipation?" },
      { id: "d5", text: "Bloating?" },
      { id: "d6", text: "Abdominal pain?" },
      { id: "d7", text: "Intolerance to certain foods?" },
      { id: "d8", text: "Nausea or vomiting?" },
      { id: "d9", text: "Severe diarrhea with blood or mucus?" },
    ],
  },
  {
    id: "kidney",
    name: "Kidney",
    maxScore: 20,
    questions: [
      { id: "k1", text: "Increased urination frequency and amount?" },
      { id: "k2", text: "Needing to get up at night to pass urine?" },
      { id: "k3", text: "Urinary tract infections or cystitis?" },
      { id: "k4", text: "Kidney stones?" },
      { id: "k5", text: "Blood in urine?" },
    ],
  },
  {
    id: "joints",
    name: "Joints & Muscles",
    maxScore: 20,
    questions: [
      { id: "j1", text: "Fleeting muscle or joint aches?" },
      {
        id: "j2",
        text: "Tendinitis (tennis elbow, golfer's elbow, Achilles tendinitis)?",
      },
      { id: "j3", text: "Gout?" },
      { id: "j4", text: "Arthritis?" },
      { id: "j5", text: "Fibromyalgia?" },
    ],
  },
  {
    id: "metabolism",
    name: "Metabolism",
    maxScore: 24,
    questions: [
      { id: "m1", text: "Feeling of coldness?" },
      { id: "m2", text: "Hypoglycemia?" },
      { id: "m3", text: "Craving certain foods?" },
      { id: "m4", text: "Water retention?" },
      { id: "m5", text: "Obesity?" },
      { id: "m6", text: "Cellulite?" },
    ],
  },
];

export const MAX_TOTAL_SCORE = CATEGORIES.reduce((sum, c) => sum + c.maxScore, 0);

export const TOTAL_QUESTIONS = CATEGORIES.reduce(
  (sum, c) => sum + c.questions.length,
  0,
);

export function getCategoryTestLabel(name: string): string {
  return `${name} Test`;
}
