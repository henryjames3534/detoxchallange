export type SymptomFrequency = 0 | 1 | 2 | 3 | 4;

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  testDate: string;
  unitSystem: "imperial" | "metric";
  heightFeet?: number;
  heightInches?: number;
  heightCm?: number;
  weightLbs?: number;
  weightKg?: number;
}

export interface Question {
  id: string;
  text: string;
}

export interface Category {
  id: string;
  name: string;
  maxScore: number;
  questions: Question[];
}

export interface ChallengeAnswers {
  personal: PersonalInfo;
  /** categoryId -> questionId -> score */
  scores: Record<string, Record<string, SymptomFrequency>>;
}

export interface CategoryResult {
  categoryId: string;
  name: string;
  score: number;
  maxScore: number;
  percent: number;
}

export interface ChallengeResults {
  personal: PersonalInfo;
  categories: CategoryResult[];
  grandTotal: number;
  maxTotal: number;
  toxicLevelPercent: number;
  toxicLevelLabel: string;
  completedAt: string;
  /** Client-generated idempotency key — one submission, one email */
  submissionId?: string;
}
