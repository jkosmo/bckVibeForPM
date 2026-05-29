import type { DependencyStatus, DependencyType } from "../models/dependency";
import type { Filters, RiskSort } from "../models/filters";
import type { RiskLevel, RiskStatus } from "../models/risk";
import {
  dependencyStatusLabels,
  dependencyTypeLabels,
  riskStatusLabels,
} from "../utils/labels";
import { getRiskLevelLabel } from "../utils/riskScoring";

interface FiltersPanelProps {
  filters: Filters;
  owners: string[];
  onChange: (filters: Filters) => void;
}

const riskStatusOptions: Array<RiskStatus | "all"> = [
  "all",
  "open",
  "inProgress",
  "mitigated",
  "closed",
];
const dependencyStatusOptions: Array<DependencyStatus | "all"> = [
  "all",
  "notStarted",
  "inProgress",
  "blocked",
  "resolved",
];
const riskLevelOptions: Array<RiskLevel | "all"> = [
  "all",
  "low",
  "medium",
  "high",
];
const dependencyTypeOptions: Array<DependencyType | "all"> = [
  "all",
  "internalDelivery",
  "externalParty",
  "decision",
  "technicalClarification",
  "resource",
  "procurement",
  "other",
];
const riskSortOptions: RiskSort[] = ["score", "dueDate", "status", "owner"];

export function FiltersPanel({ filters, owners, onChange }: FiltersPanelProps) {
  return (
    <section className="panel panel--span-12" aria-labelledby="filters-heading">
      <div className="panel-header panel-header--compact">
        <div>
          <p className="eyebrow">Filtre</p>
          <h2 id="filters-heading">Avgrens demo-visningen</h2>
        </div>
      </div>

      <div className="filters-grid">
        <label>
          Ansvarlig
          <select
            value={filters.owner}
            onChange={(event) => onChange({ ...filters, owner: event.target.value })}
          >
            <option value="all">Alle</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </label>

        <label>
          Risikostatus
          <select
            value={filters.riskStatus}
            onChange={(event) =>
              onChange({
                ...filters,
                riskStatus: event.target.value as Filters["riskStatus"],
              })
            }
          >
            {riskStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "Alle" : riskStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Risikonivå
          <select
            value={filters.riskLevel}
            onChange={(event) =>
              onChange({
                ...filters,
                riskLevel: event.target.value as Filters["riskLevel"],
              })
            }
          >
            {riskLevelOptions.map((level) => (
              <option key={level} value={level}>
                {level === "all" ? "Alle" : getRiskLevelLabel(level)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sorter risiko
          <select
            value={filters.riskSort}
            onChange={(event) =>
              onChange({ ...filters, riskSort: event.target.value as RiskSort })
            }
          >
            {riskSortOptions.map((sort) => (
              <option key={sort} value={sort}>
                {getRiskSortLabel(sort)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Avhengighetsstatus
          <select
            value={filters.dependencyStatus}
            onChange={(event) =>
              onChange({
                ...filters,
                dependencyStatus: event.target.value as Filters["dependencyStatus"],
              })
            }
          >
            {dependencyStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "Alle" : dependencyStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Avhengighetstype
          <select
            value={filters.dependencyType}
            onChange={(event) =>
              onChange({
                ...filters,
                dependencyType: event.target.value as Filters["dependencyType"],
              })
            }
          >
            {dependencyTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "Alle" : dependencyTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function getRiskSortLabel(sort: RiskSort) {
  const labels: Record<RiskSort, string> = {
    score: "Score",
    dueDate: "Frist",
    status: "Status",
    owner: "Ansvarlig",
  };

  return labels[sort];
}
