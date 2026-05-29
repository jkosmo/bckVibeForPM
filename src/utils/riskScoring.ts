import type { Risk, RiskLevel } from "../models/risk";

export function calculateRiskScore(risk: Pick<Risk, "probability" | "impact">) {
  return risk.probability * risk.impact;
}

export function getRiskLevel(risk: Pick<Risk, "probability" | "impact">): RiskLevel {
  const score = calculateRiskScore(risk);

  if (score <= 5) {
    return "low";
  }

  if (score <= 12) {
    return "medium";
  }

  return "high";
}

export function getRiskLevelLabel(level: RiskLevel) {
  const labels: Record<RiskLevel, string> = {
    low: "Lav",
    medium: "Middels",
    high: "Høy",
  };

  return labels[level];
}
