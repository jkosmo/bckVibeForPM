import type { Dependency } from "../models/dependency";
import type { Risk } from "../models/risk";

const now = new Date("2026-05-29T08:00:00.000Z").toISOString();

export const seedRisks: Risk[] = [
  {
    id: "risk-architecture-decision",
    title: "Forsinket beslutning om løsningsvalg",
    description:
      "Målarkitektur er ikke besluttet, og flere leveranser venter på avklaring.",
    probability: 4,
    impact: 5,
    owner: "Prosjektleder",
    status: "open",
    mitigation: "Eskalere beslutningsbehov til styringsgruppen.",
    dueDate: "2026-06-05",
    dependencyIds: ["dep-target-architecture"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "risk-key-resources",
    title: "Manglende tilgang til nøkkelressurser",
    description:
      "To nøkkelressurser er bare delvis tilgjengelige i perioden for test og avklaring.",
    probability: 3,
    impact: 4,
    owner: "Ressursansvarlig",
    status: "inProgress",
    mitigation: "Avklare ressursplan med linjeleder og sikre backup.",
    dueDate: "2026-06-10",
    dependencyIds: ["dep-test-environment"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "risk-external-supplier",
    title: "Uklart om leverandør rekker frist",
    description:
      "Ekstern integrasjonspartner har varslet kapasitetsutfordringer.",
    probability: 3,
    impact: 5,
    owner: "Leveranseansvarlig",
    status: "open",
    mitigation: "Etablere ukentlig oppfølging med leverandør.",
    dueDate: "2026-06-14",
    dependencyIds: ["dep-integration-partner"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "risk-test-data",
    title: "Testdata mangler kvalitet",
    description:
      "Testmiljøet har ikke komplette data for å validere ende-til-ende-flyt.",
    probability: 2,
    impact: 3,
    owner: "Testleder",
    status: "mitigated",
    mitigation: "Lage minimumsdatasett sammen med fagansvarlig.",
    dueDate: "2026-06-07",
    dependencyIds: ["dep-test-environment"],
    createdAt: now,
    updatedAt: now,
  },
];

export const seedDependencies: Dependency[] = [
  {
    id: "dep-target-architecture",
    title: "Beslutning om målarkitektur",
    description: "Styringsgruppen må velge løsningsretning før videre design.",
    type: "decision",
    owner: "Styringsgruppe",
    status: "notStarted",
    dueDate: "2026-06-04",
    relatedRiskIds: ["risk-architecture-decision"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "dep-integration-partner",
    title: "Leveranse fra ekstern integrasjonspartner",
    description:
      "Avklaring av leveranseplan og teknisk kapasitet hos ekstern partner.",
    type: "externalParty",
    owner: "Integrasjonsansvarlig",
    status: "inProgress",
    dueDate: "2026-06-13",
    relatedRiskIds: ["risk-external-supplier"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "dep-test-environment",
    title: "Tilgang til testmiljø",
    description: "Miljø og testdata må være klare før integrasjonstest.",
    type: "technicalClarification",
    owner: "Teknisk leder",
    status: "blocked",
    dueDate: "2026-06-06",
    relatedRiskIds: ["risk-key-resources", "risk-test-data"],
    createdAt: now,
    updatedAt: now,
  },
];
