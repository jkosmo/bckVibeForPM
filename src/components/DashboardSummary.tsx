import type { Dependency } from "../models/dependency";
import type { Risk } from "../models/risk";
import { getRiskLevel } from "../utils/riskScoring";

interface DashboardSummaryProps {
  risks: Risk[];
  dependencies: Dependency[];
}

export function DashboardSummary({ risks, dependencies }: DashboardSummaryProps) {
  const openRisks = risks.filter((risk) => risk.status !== "closed").length;
  const highRisks = risks.filter((risk) => getRiskLevel(risk) === "high").length;
  const openDependencies = dependencies.filter(
    (dependency) => dependency.status !== "resolved",
  ).length;
  const blockedDependencies = dependencies.filter(
    (dependency) => dependency.status === "blocked",
  ).length;

  return (
    <section className="summary-grid" aria-label="Nøkkeltall">
      <SummaryItem label="Åpne risikoer" value={openRisks} tone="neutral" />
      <SummaryItem label="Høy risiko" value={highRisks} tone="critical" />
      <SummaryItem
        label="Åpne avhengigheter"
        value={openDependencies}
        tone="neutral"
      />
      <SummaryItem
        label="Blokkerte avhengigheter"
        value={blockedDependencies}
        tone="warning"
      />
    </section>
  );
}

function SummaryItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "warning" | "critical";
}) {
  return (
    <div className={`summary-item summary-item--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
