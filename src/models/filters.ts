import type { DependencyStatus, DependencyType } from "./dependency";
import type { RiskLevel, RiskStatus } from "./risk";

export type RiskSort = "score" | "dueDate" | "status" | "owner";

export interface Filters {
  owner: string;
  riskStatus: RiskStatus | "all";
  dependencyStatus: DependencyStatus | "all";
  riskLevel: RiskLevel | "all";
  dependencyType: DependencyType | "all";
  riskSort: RiskSort;
}

export const defaultFilters: Filters = {
  owner: "all",
  riskStatus: "all",
  dependencyStatus: "all",
  riskLevel: "all",
  dependencyType: "all",
  riskSort: "score",
};
