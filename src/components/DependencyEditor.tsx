import type {
  Dependency,
  DependencyStatus,
  DependencyType,
} from "../models/dependency";
import type { Risk } from "../models/risk";
import { dependencyStatusLabels, dependencyTypeLabels } from "../utils/labels";

const dependencyTypes: DependencyType[] = [
  "internalDelivery",
  "externalParty",
  "decision",
  "technicalClarification",
  "resource",
  "procurement",
  "other",
];

const dependencyStatuses: DependencyStatus[] = [
  "notStarted",
  "inProgress",
  "blocked",
  "resolved",
];

interface DependencyEditorProps {
  dependency: Dependency;
  risks: Risk[];
  onDeleteDependency: (dependencyId: string) => void;
  onUpdateDependency: (dependency: Dependency) => void;
}

export function DependencyEditor({
  dependency,
  risks,
  onDeleteDependency,
  onUpdateDependency,
}: DependencyEditorProps) {
  function updateDependency(patch: Partial<Dependency>) {
    onUpdateDependency({
      ...dependency,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  function toggleRisk(riskId: string) {
    const relatedRiskIds = dependency.relatedRiskIds.includes(riskId)
      ? dependency.relatedRiskIds.filter((id) => id !== riskId)
      : [...dependency.relatedRiskIds, riskId];

    updateDependency({ relatedRiskIds });
  }

  return (
    <section className="panel panel--span-5" aria-labelledby="dependency-editor-heading">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Avhengighetsskjema</p>
          <h2 id="dependency-editor-heading">
            {dependency.title || "Ny avhengighet"}
          </h2>
        </div>
        <span className={`status-pill status-pill--${dependency.status}`}>
          {dependencyStatusLabels[dependency.status]}
        </span>
      </div>

      <div className="form-stack">
        <label>
          Tittel
          <input
            aria-invalid={!dependency.title.trim()}
            value={dependency.title}
            onChange={(event) => updateDependency({ title: event.target.value })}
            required
          />
          {!dependency.title.trim() ? (
            <span className="field-warning">Tittel må fylles ut.</span>
          ) : null}
        </label>

        <label>
          Beskrivelse
          <textarea
            value={dependency.description}
            rows={3}
            onChange={(event) =>
              updateDependency({ description: event.target.value })
            }
          />
        </label>

        <div className="field-grid field-grid--two">
          <label>
            Type
            <select
              value={dependency.type}
              onChange={(event) =>
                updateDependency({ type: event.target.value as DependencyType })
              }
            >
              {dependencyTypes.map((type) => (
                <option key={type} value={type}>
                  {dependencyTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={dependency.status}
              onChange={(event) =>
                updateDependency({ status: event.target.value as DependencyStatus })
              }
            >
              {dependencyStatuses.map((status) => (
                <option key={status} value={status}>
                  {dependencyStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-grid field-grid--two">
          <label>
            Ansvarlig
            <input
              value={dependency.owner}
              onChange={(event) => updateDependency({ owner: event.target.value })}
            />
          </label>

          <label>
            Frist
            <input
              type="date"
              value={dependency.dueDate ?? ""}
              onChange={(event) => updateDependency({ dueDate: event.target.value })}
            />
          </label>
        </div>

        <fieldset>
          <legend>Koblede risikoer</legend>
          <div className="checkbox-grid">
            {risks.map((risk) => (
              <label className="checkbox-row" key={risk.id}>
                <input
                  type="checkbox"
                  checked={dependency.relatedRiskIds.includes(risk.id)}
                  onChange={() => toggleRisk(risk.id)}
                />
                <span>{risk.title}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="button-row">
          <button
            className="danger-button"
            type="button"
            onClick={() => onDeleteDependency(dependency.id)}
          >
            Slett avhengighet
          </button>
        </div>
      </div>
    </section>
  );
}
