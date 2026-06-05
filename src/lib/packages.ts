import { MAX_TOTAL_SCORE } from "./questionnaire";

export interface DetoxPackage {
  package: number;
  sessions: number;
  toxicLevelLabel: string;
  toxicLevelMin: number;
  toxicLevelMax: number;
  pointMin: number;
  pointMax: number;
}

export const DETOX_PACKAGES: DetoxPackage[] = [
  {
    package: 1,
    sessions: 5,
    toxicLevelLabel: "1–20%",
    toxicLevelMin: 1,
    toxicLevelMax: 20,
    pointMin: 0,
    pointMax: 50,
  },
  {
    package: 2,
    sessions: 7,
    toxicLevelLabel: "21–40%",
    toxicLevelMin: 21,
    toxicLevelMax: 40,
    pointMin: 51,
    pointMax: 100,
  },
  {
    package: 3,
    sessions: 10,
    toxicLevelLabel: "41–60%",
    toxicLevelMin: 41,
    toxicLevelMax: 60,
    pointMin: 101,
    pointMax: 150,
  },
  {
    package: 4,
    sessions: 15,
    toxicLevelLabel: "61–80%",
    toxicLevelMin: 61,
    toxicLevelMax: 80,
    pointMin: 151,
    pointMax: 200,
  },
  {
    package: 5,
    sessions: 20,
    toxicLevelLabel: "81–100%",
    toxicLevelMin: 81,
    toxicLevelMax: 100,
    pointMin: 201,
    pointMax: MAX_TOTAL_SCORE,
  },
];

export function getPointRangeLabel(pkg: DetoxPackage): string {
  return `${pkg.pointMin}–${pkg.pointMax}`;
}

export function getRecommendedPackage(grandTotal: number): DetoxPackage {
  const clamped = Math.max(0, Math.min(grandTotal, MAX_TOTAL_SCORE));

  return (
    DETOX_PACKAGES.find(
      (pkg) => clamped >= pkg.pointMin && clamped <= pkg.pointMax,
    ) ?? DETOX_PACKAGES[DETOX_PACKAGES.length - 1]
  );
}

export function isPackageMatch(
  pkg: DetoxPackage,
  grandTotal: number,
): boolean {
  return getRecommendedPackage(grandTotal).package === pkg.package;
}
