import { CATEGORIES, MAX_TOTAL_SCORE } from "./questionnaire";
import type {
  CategoryResult,
  ChallengeAnswers,
  ChallengeResults,
  SymptomFrequency,
} from "./types";
import { nowIsoUtc } from "./timezone";

export function getCategoryScore(
  answers: Record<string, SymptomFrequency> | undefined,
): number {
  if (!answers) return 0;
  return Object.values(answers).reduce<number>(
    (sum, v) => sum + (v ?? 0),
    0,
  );
}

export function computeResults(data: ChallengeAnswers): ChallengeResults {
  const categories: CategoryResult[] = CATEGORIES.map((cat) => {
    const score = getCategoryScore(data.scores[cat.id]);
    return {
      categoryId: cat.id,
      name: cat.name,
      score,
      maxScore: cat.maxScore,
      percent: cat.maxScore > 0 ? (score / cat.maxScore) * 100 : 0,
    };
  });

  const grandTotal = categories.reduce((sum, c) => sum + c.score, 0);
  const toxicLevelPercent =
    MAX_TOTAL_SCORE > 0 ? (grandTotal / MAX_TOTAL_SCORE) * 100 : 0;

  return {
    personal: data.personal,
    categories,
    grandTotal,
    maxTotal: MAX_TOTAL_SCORE,
    toxicLevelPercent,
    toxicLevelLabel: getToxicLevelLabel(toxicLevelPercent),
    completedAt: nowIsoUtc(),
  };
}

export function getToxicLevelLabel(percent: number): string {
  if (percent < 15) return "Low toxic burden";
  if (percent < 30) return "Mild toxic burden";
  if (percent < 50) return "Moderate toxic burden";
  if (percent < 70) return "Elevated toxic burden";
  return "High toxic burden — consultation recommended";
}

export function getToxicLevelColor(percent: number): string {
  if (percent < 15) return "#22c55e";
  if (percent < 30) return "#84cc16";
  if (percent < 50) return "#eab308";
  if (percent < 70) return "#f97316";
  return "#ef4444";
}
