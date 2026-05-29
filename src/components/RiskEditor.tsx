import type { Dependency } from "../models/dependency";
import type { Risk, RiskScale, RiskStatus } from "../models/risk";
import { dependencyTypeLabels, riskStatusLabels } from "../utils/labels";
import { calculateRiskScore, getRiskLevel, getRiskLevelLabel } from "../utils/riskScoring";

const scaleOptions: RiskScale[] = [1, 2, 3, 4, 5];
const statusOptions: RiskStatus[] = ["open", "inProgress", "mitigated", "closed"];

interface RiskEditorProps {
  dependencies: Dependency[];
  risk: Risk;
  onDeleteRisk: (riskId: string) => void;
  onUpdateRisk: (risk: Risk) => void;
}

export function RiskEditor({
  dependencies,
  risk,
  onDeleteRisk,
  onUpdateRisk,
}: RiskEditorProps) {
  const level = getRiskLevel(risk);

  function updateRisk(patch: Partial<Risk>) {
    onUpdateRisk({
      ...risk,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  function toggleDependency(dependencyId: string) {
    const dependencyIds = risk.dependencyIds.includes(dependencyId)
      ? risk.dependencyIds.filter((id) => id !== dependencyId)
      : [...risk.dependencyIds, dependencyId];

    updateRisk({ dependencyIds });
  }

  return (
    <section className="panel panel--span-5" aria-labelledby="risk-editor-heading">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Risikoskjema</p>
          <h2 id="risk-editor-heading">{risk.title || "Ny risiko"}</h2>
        </div>
        <span className={`risk-badge risk-badge--${level}`}>
          {calculateRiskScore(risk)} · {getRiskLevelLabel(level)}
        </span>
      </div>

      <div className="form-stack">
        <label>
          Tittel
          <input
            aria-invalid={!risk.title.trim()}
            value={risk.title}
            onChange={(event) => updateRisk({ title: event.target.value })}
            required
          />
          {!risk.title.trim() ? (
            <span className="field-warning">Tittel må fylles ut.</span>
          ) : null}
        </label>

        <label>
          Beskrivelse
          <textarea
            value={risk.description}
            rows={3}
            onChange={(event) => updateRisk({ description: event.target.value })}
          />
        </label>

        <div className="field-grid">
          <label>
            Sannsynlighet
            <select
              value={risk.probability}
              onChange={(event) =>
                updateRisk({ probability: Number(event.target.value) as RiskScale })
              }
            >
              {scaleOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label>
            Konsekvens
            <select
              value={risk.impact}
              onChange={(event) =>
                updateRisk({ impact: Number(event.target.value) as RiskScale })
              }
            >
              {scaleOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={risk.status}
              onChange={(event) => updateRisk({ status: event.target.value as RiskStatus })}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {riskStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-grid field-grid--two">
          <label>
            Ansvarlig
            <input
              value={risk.owner}
              onChange={(event) => updateRisk({ owner: event.target.value })}
            />
          </label>

          <label>
            Frist
            <input
              type="date"
              value={risk.dueDate ?? ""}
              onChange={(event) => updateRisk({ dueDate: event.target.value })}
            />
          </label>
        </div>

        <label>
          Tiltak
          <textarea
            value={risk.mitigation}
            rows={3}
            onChange={(event) => updateRisk({ mitigation: event.target.value })}
          />
        </label>

        <fieldset>
          <legend>Koblede avhengigheter</legend>
          <div className="checkbox-grid">
            {dependencies.map((dependency) => (
              <label className="checkbox-row" key={dependency.id}>
                <input
                  type="checkbox"
                  checked={risk.dependencyIds.includes(dependency.id)}
                  onChange={() => toggleDependency(dependency.id)}
                />
                <span>
                  {dependency.title}
                  <small>{dependencyTypeLabels[dependency.type]}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="button-row">
          <button
            className="danger-button"
            type="button"
            onClick={() => onDeleteRisk(risk.id)}
          >
            Slett risiko
          </button>
        </div>
      </div>
    </section>
  );
}
