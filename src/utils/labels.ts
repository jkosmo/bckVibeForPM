import type { Dependency } from "../models/dependency";
import type { Risk } from "../models/risk";

export const riskStatusLabels: Record<Risk["status"], string> = {
  open: "Åpen",
  inProgress: "Pågår",
  mitigated: "Tiltak satt",
  closed: "Lukket",
};

export const dependencyTypeLabels: Record<Dependency["type"], string> = {
  internalDelivery: "Intern leveranse",
  externalParty: "Ekstern aktør",
  decision: "Beslutning",
  technicalClarification: "Teknisk avklaring",
  resource: "Ressurstilgang",
  procurement: "Juridisk/anskaffelse",
  other: "Annet",
};

export const dependencyStatusLabels: Record<Dependency["status"], string> = {
  notStarted: "Ikke startet",
  inProgress: "Pågår",
  blocked: "Blokkert",
  resolved: "Løst",
};
