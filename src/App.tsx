import { DashboardSummary } from "./components/DashboardSummary";
import { DependencyEditor } from "./components/DependencyEditor";
import { DependencyList } from "./components/DependencyList";
import { FiltersPanel } from "./components/FiltersPanel";
import { RiskEditor } from "./components/RiskEditor";
import { RiskList } from "./components/RiskList";
import { RiskMatrix } from "./components/RiskMatrix";
import { seedDependencies, seedRisks } from "./data/seedData";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Dependency } from "./models/dependency";
import { defaultFilters, type Filters } from "./models/filters";
import type { Risk } from "./models/risk";
import { getRiskLevel, calculateRiskScore } from "./utils/riskScoring";

const riskStorageKey = "risk-radar:risks";
const dependencyStorageKey = "risk-radar:dependencies";

function App() {
  const [risks, setRisks] = useLocalStorage<Risk[]>(riskStorageKey, seedRisks);
  const [dependencies, setDependencies] = useLocalStorage<Dependency[]>(
    dependencyStorageKey,
    seedDependencies,
  );
  const [selectedRiskId, setSelectedRiskId] = useLocalStorage<string>(
    "risk-radar:selected-risk",
    seedRisks[0].id,
  );
  const [selectedDependencyId, setSelectedDependencyId] = useLocalStorage<string>(
    "risk-radar:selected-dependency",
    seedDependencies[0].id,
  );
  const [filters, setFilters] = useLocalStorage<Filters>(
    "risk-radar:filters",
    defaultFilters,
  );

  const owners = Array.from(
    new Set([
      ...risks.map((risk) => risk.owner).filter(Boolean),
      ...dependencies.map((dependency) => dependency.owner).filter(Boolean),
    ]),
  ).sort((a, b) => a.localeCompare(b, "nb"));

  const filteredRisks = sortRisks(
    risks.filter((risk) => {
      const ownerMatch = filters.owner === "all" || risk.owner === filters.owner;
      const statusMatch =
        filters.riskStatus === "all" || risk.status === filters.riskStatus;
      const levelMatch =
        filters.riskLevel === "all" || getRiskLevel(risk) === filters.riskLevel;

      return ownerMatch && statusMatch && levelMatch;
    }),
    filters,
  );

  const filteredDependencies = dependencies.filter((dependency) => {
    const ownerMatch =
      filters.owner === "all" || dependency.owner === filters.owner;
    const statusMatch =
      filters.dependencyStatus === "all" ||
      dependency.status === filters.dependencyStatus;
    const typeMatch =
      filters.dependencyType === "all" || dependency.type === filters.dependencyType;

    return ownerMatch && statusMatch && typeMatch;
  });

  const selectedRisk = risks.find((risk) => risk.id === selectedRiskId) ?? risks[0];
  const selectedDependency =
    dependencies.find((dependency) => dependency.id === selectedDependencyId) ??
    dependencies[0];

  function handleCreateRisk() {
    const risk = createRisk();
    setRisks((currentRisks) => [...currentRisks, risk]);
    setSelectedRiskId(risk.id);
  }

  function handleUpdateRisk(updatedRisk: Risk) {
    setRisks((currentRisks) =>
      currentRisks.map((risk) => (risk.id === updatedRisk.id ? updatedRisk : risk)),
    );
    setDependencies((currentDependencies) =>
      currentDependencies.map((dependency) => ({
        ...dependency,
        relatedRiskIds: updatedRisk.dependencyIds.includes(dependency.id)
          ? Array.from(new Set([...dependency.relatedRiskIds, updatedRisk.id]))
          : dependency.relatedRiskIds.filter((riskId) => riskId !== updatedRisk.id),
        updatedAt: new Date().toISOString(),
      })),
    );
  }

  function handleDeleteRisk(riskId: string) {
    setRisks((currentRisks) => {
      const remainingRisks = currentRisks.filter((risk) => risk.id !== riskId);
      setSelectedRiskId(remainingRisks[0]?.id ?? "");
      return remainingRisks;
    });
    setDependencies((currentDependencies) =>
      currentDependencies.map((dependency) => ({
        ...dependency,
        relatedRiskIds: dependency.relatedRiskIds.filter((id) => id !== riskId),
        updatedAt: new Date().toISOString(),
      })),
    );
  }

  function handleCreateDependency() {
    const dependency = createDependency();
    setDependencies((currentDependencies) => [...currentDependencies, dependency]);
    setSelectedDependencyId(dependency.id);
  }

  function handleUpdateDependency(updatedDependency: Dependency) {
    setDependencies((currentDependencies) =>
      currentDependencies.map((dependency) =>
        dependency.id === updatedDependency.id ? updatedDependency : dependency,
      ),
    );
    setRisks((currentRisks) =>
      currentRisks.map((risk) => ({
        ...risk,
        dependencyIds: updatedDependency.relatedRiskIds.includes(risk.id)
          ? Array.from(new Set([...risk.dependencyIds, updatedDependency.id]))
          : risk.dependencyIds.filter(
              (dependencyId) => dependencyId !== updatedDependency.id,
            ),
        updatedAt: new Date().toISOString(),
      })),
    );
  }

  function handleDeleteDependency(dependencyId: string) {
    setDependencies((currentDependencies) => {
      const remainingDependencies = currentDependencies.filter(
        (dependency) => dependency.id !== dependencyId,
      );
      setSelectedDependencyId(remainingDependencies[0]?.id ?? "");
      return remainingDependencies;
    });
    setRisks((currentRisks) =>
      currentRisks.map((risk) => ({
        ...risk,
        dependencyIds: risk.dependencyIds.filter((id) => id !== dependencyId),
        updatedAt: new Date().toISOString(),
      })),
    );
  }

  function handleResetDemo() {
    setRisks(seedRisks);
    setDependencies(seedDependencies);
    setSelectedRiskId(seedRisks[0].id);
    setSelectedDependencyId(seedDependencies[0].id);
    setFilters(defaultFilters);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Neste vertikale slice</p>
          <h1>Risiko- og avhengighetsradar</h1>
        </div>
        <button className="secondary-button" type="button" onClick={handleResetDemo}>
          Nullstill demo-data
        </button>
      </header>

      <DashboardSummary risks={risks} dependencies={dependencies} />

      <div className="content-grid">
        <FiltersPanel filters={filters} owners={owners} onChange={setFilters} />
        <RiskList
          risks={filteredRisks}
          selectedRiskId={selectedRisk?.id ?? ""}
          onCreateRisk={handleCreateRisk}
          onSelectRisk={setSelectedRiskId}
        />
        {selectedRisk ? (
          <RiskEditor
            dependencies={dependencies}
            risk={selectedRisk}
            onDeleteRisk={handleDeleteRisk}
            onUpdateRisk={handleUpdateRisk}
          />
        ) : (
          <EmptyPanel
            eyebrow="Risikoskjema"
            title="Ingen risiko valgt"
            actionLabel="Ny risiko"
            onAction={handleCreateRisk}
          />
        )}
        <RiskMatrix
          risks={filteredRisks}
          selectedRiskId={selectedRisk?.id ?? ""}
          onSelectRisk={setSelectedRiskId}
        />
        <DependencyList
          dependencies={filteredDependencies}
          risks={risks}
          selectedDependencyId={selectedDependency?.id ?? ""}
          onCreateDependency={handleCreateDependency}
          onSelectDependency={setSelectedDependencyId}
          onSelectRisk={setSelectedRiskId}
        />
        {selectedDependency ? (
          <DependencyEditor
            dependency={selectedDependency}
            risks={risks}
            onDeleteDependency={handleDeleteDependency}
            onUpdateDependency={handleUpdateDependency}
          />
        ) : (
          <EmptyPanel
            eyebrow="Avhengighetsskjema"
            title="Ingen avhengighet valgt"
            actionLabel="Ny avhengighet"
            onAction={handleCreateDependency}
          />
        )}
      </div>
    </main>
  );
}

function EmptyPanel({
  actionLabel,
  eyebrow,
  onAction,
  title,
}: {
  actionLabel: string;
  eyebrow: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <section className="panel panel--span-5">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>
      <p className="muted">Opprett et nytt element for å fortsette demoen.</p>
      <button className="secondary-button" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </section>
  );
}

function createRisk(): Risk {
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();

  return {
    id,
    title: "Ny risiko",
    description: "Beskriv hva som kan påvirke prosjektet.",
    probability: 3,
    impact: 3,
    owner: "Prosjektleder",
    status: "open",
    mitigation: "Avklar neste tiltak.",
    dueDate: "",
    dependencyIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDependency(): Dependency {
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();

  return {
    id,
    title: "Ny avhengighet",
    description: "Beskriv leveranse, beslutning eller avklaring.",
    type: "decision",
    owner: "Prosjektleder",
    status: "notStarted",
    dueDate: "",
    relatedRiskIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function sortRisks(risks: Risk[], filters: Filters) {
  return [...risks].sort((a, b) => {
    if (filters.riskSort === "score") {
      return calculateRiskScore(b) - calculateRiskScore(a);
    }

    if (filters.riskSort === "dueDate") {
      return (a.dueDate || "9999-12-31").localeCompare(
        b.dueDate || "9999-12-31",
      );
    }

    if (filters.riskSort === "status") {
      return a.status.localeCompare(b.status, "nb");
    }

    return a.owner.localeCompare(b.owner, "nb");
  });
}

export default App;
