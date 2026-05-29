import type { Risk } from "../models/risk";
import { getRiskLevel, getRiskLevelLabel } from "../utils/riskScoring";

const scale = [1, 2, 3, 4, 5] as const;
const reversedScale = [...scale].reverse();

interface RiskMatrixProps {
  risks: Risk[];
  selectedRiskId: string;
  onSelectRisk: (riskId: string) => void;
}

export function RiskMatrix({ risks, selectedRiskId, onSelectRisk }: RiskMatrixProps) {
  return (
    <section className="panel panel--span-7" aria-labelledby="risk-matrix-heading">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Matrise</p>
          <h2 id="risk-matrix-heading">Sannsynlighet x konsekvens</h2>
        </div>
      </div>

      <div className="matrix-shell">
        <div className="matrix-y-label">Sannsynlighet</div>
        <div className="matrix-grid" role="grid" aria-label="Risikomatrise">
          <div className="matrix-corner" />
          {scale.map((impact) => (
            <div className="axis-label" key={`impact-${impact}`}>
              {impact}
            </div>
          ))}

          {reversedScale.map((probability) => (
            <MatrixRow
              key={`probability-${probability}`}
              probability={probability}
              risks={risks}
              selectedRiskId={selectedRiskId}
              onSelectRisk={onSelectRisk}
            />
          ))}
        </div>
        <div className="matrix-x-label">Konsekvens</div>
      </div>
    </section>
  );
}

function MatrixRow({
  probability,
  risks,
  selectedRiskId,
  onSelectRisk,
}: {
  probability: Risk["probability"];
  risks: Risk[];
  selectedRiskId: string;
  onSelectRisk: (riskId: string) => void;
}) {
  return (
    <>
      <div className="axis-label">{probability}</div>
      {scale.map((impact) => {
        const cellRisks = risks.filter(
          (risk) => risk.probability === probability && risk.impact === impact,
        );
        const level = getRiskLevel({ probability, impact });

        return (
          <div
            className={`matrix-cell matrix-cell--${level}`}
            key={`${probability}-${impact}`}
            role="gridcell"
            aria-label={`${cellRisks.length} risikoer med sannsynlighet ${probability}, konsekvens ${impact} og ${getRiskLevelLabel(level).toLowerCase()} risikonivå`}
          >
            <span className="cell-level">{getRiskLevelLabel(level)}</span>
            <span className="cell-count">{cellRisks.length}</span>
            <div className="cell-risks">
              {cellRisks.map((risk) => (
                <button
                  className={`risk-chip ${risk.id === selectedRiskId ? "is-active" : ""}`}
                  key={risk.id}
                  type="button"
                  onClick={() => onSelectRisk(risk.id)}
                  title={risk.title}
                >
                  {risk.title}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
