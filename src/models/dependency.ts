export type DependencyStatus =
  | "notStarted"
  | "inProgress"
  | "blocked"
  | "resolved";

export type DependencyType =
  | "internalDelivery"
  | "externalParty"
  | "decision"
  | "technicalClarification"
  | "resource"
  | "procurement"
  | "other";

export interface Dependency {
  id: string;
  title: string;
  description: string;
  type: DependencyType;
  owner: string;
  status: DependencyStatus;
  dueDate?: string;
  relatedRiskIds: string[];
  createdAt: string;
  updatedAt: string;
}
