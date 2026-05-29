import type { Risk } from "../models/risk";
import { riskStatusLabels } from "../utils/labels";
import { calculateRiskScore, getRiskLevel, getRiskLevelLabel } from "../utils/riskScoring";

interface RiskListProps {
  risks: Risk[];
  selectedRiskId: string;
  onCreateRisk: () => void;
  onSelectRisk: (riskId: string) => void;
}

export function RiskList({
  risks,
  selectedRiskId,
  onCreateRisk,
  onSelectRisk,
}: RiskListProps) {
  return (
    <section className="panel panel--span-7" aria-labelledby="risk-list-heading">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Risikoer</p>
          <h2 id="risk-list-heading">Aktive prosjektforhold</h2>
        </div>
        <button className="secondary-button" type="button" onClick={onCreateRisk}>
          Ny risiko
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Risiko</th>
              <th>Eier</th>
              <th>Status</th>
              <th>Score</th>
              <th>Frist</th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 ? (
              <tr>
                <td colSpan={5}>Ingen risikoer matcher filtrene.</td>
              </tr>
            ) : null}
            {risks.map((risk) => {
              const level = getRiskLevel(risk);

              return (
                <tr
                  key={risk.id}
                  className={risk.id === selectedRiskId ? "is-selected" : ""}
                >
                  <td>
                    <button
                      className="link-button"
                      type="button"
                      onClick={() => onSelectRisk(risk.id)}
                    >
                      {risk.title}
                    </button>
                  </td>
                  <td>{risk.owner}</td>
                  <td>{riskStatusLabels[risk.status]}</td>
                  <td>
                    <span className={`risk-badge risk-badge--${level}`}>
                      {calculateRiskScore(risk)} · {getRiskLevelLabel(level)}
                    </span>
                  </td>
                  <td>{risk.dueDate ?? "Ikke satt"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
