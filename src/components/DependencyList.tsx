import type { Dependency } from "../models/dependency";
import type { Risk } from "../models/risk";
import { dependencyStatusLabels, dependencyTypeLabels } from "../utils/labels";

interface DependencyListProps {
  dependencies: Dependency[];
  risks: Risk[];
  selectedDependencyId: string;
  onCreateDependency: () => void;
  onSelectDependency: (dependencyId: string) => void;
  onSelectRisk: (riskId: string) => void;
}

export function DependencyList({
  dependencies,
  risks,
  selectedDependencyId,
  onCreateDependency,
  onSelectDependency,
  onSelectRisk,
}: DependencyListProps) {
  return (
    <section className="panel panel--span-7" aria-labelledby="dependency-heading">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Avhengigheter</p>
          <h2 id="dependency-heading">Leveranser og avklaringer</h2>
        </div>
        <button className="secondary-button" type="button" onClick={onCreateDependency}>
          Ny avhengighet
        </button>
      </div>

      <div className="dependency-stack">
        {dependencies.length === 0 ? (
          <p className="muted">Ingen avhengigheter matcher filtrene.</p>
        ) : null}
        {dependencies.map((dependency) => {
          const relatedRisks = dependency.relatedRiskIds
            .map((riskId) => risks.find((risk) => risk.id === riskId))
            .filter((risk): risk is Risk => Boolean(risk));

          return (
            <article
              className={`dependency-item ${
                dependency.id === selectedDependencyId ? "is-selected" : ""
              }`}
              key={dependency.id}
            >
              <div className="dependency-item__header">
                <div>
                  <button
                    className="link-button"
                    type="button"
                    onClick={() => onSelectDependency(dependency.id)}
                  >
                    <h3>{dependency.title}</h3>
                  </button>
                  <p>
                    {dependencyTypeLabels[dependency.type]} · {dependency.owner}
                  </p>
                </div>
                <span className={`status-pill status-pill--${dependency.status}`}>
                  {dependencyStatusLabels[dependency.status]}
                </span>
              </div>
              <p className="muted">{dependency.description}</p>
              <div className="related-row" aria-label="Koblede risikoer">
                {relatedRisks.map((risk) => (
                  <button
                    key={risk.id}
                    type="button"
                    className="mini-chip"
                    onClick={() => onSelectRisk(risk.id)}
                  >
                    {risk.title}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
