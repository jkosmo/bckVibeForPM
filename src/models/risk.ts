export type RiskStatus = "open" | "inProgress" | "mitigated" | "closed";
export type RiskLevel = "low" | "medium" | "high";
export type RiskScale = 1 | 2 | 3 | 4 | 5;

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: RiskScale;
  impact: RiskScale;
  owner: string;
  status: RiskStatus;
  mitigation: string;
  dueDate?: string;
  dependencyIds: string[];
  createdAt: string;
  updatedAt: string;
}
