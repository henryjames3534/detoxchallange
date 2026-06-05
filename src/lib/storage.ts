import type { ChallengeAnswers, ChallengeResults } from "./types";

const ANSWERS_KEY = "detox-challenge-answers";
const RESULTS_KEY = "detox-challenge-results";

export function saveAnswers(data: ChallengeAnswers): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(data));
}

export function loadAnswers(): ChallengeAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as ChallengeAnswers) : null;
  } catch {
    return null;
  }
}

export function saveResults(data: ChallengeResults): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(data));
}

export function loadResults(): ChallengeResults | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? (JSON.parse(raw) as ChallengeResults) : null;
  } catch {
    return null;
  }
}

export function clearChallengeData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANSWERS_KEY);
  localStorage.removeItem(RESULTS_KEY);
}
