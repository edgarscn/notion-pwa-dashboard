import React from "react";

export function SubjectPerformanceChart({ materias = [] }) {
  if (!materias.length) {
    return <p className="metric-subtext">Nenhum dado de matéria disponível.</p>;
  }

  return (
    <div className="chart-container">
      {materias.map((m, idx) => {
        const accuracy = m.taxaAcerto || 0;
        let fillColor = "var(--success)";
        if (accuracy < 70) fillColor = "var(--danger)";
        else if (accuracy < 80) fillColor = "var(--warning)";

        return (
          <div key={idx} className="subject-bar-item">
            <div className="subject-bar-info">
              <span>{m.materia}</span>
              <span>
                {accuracy}% <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>({m.acertos}/{m.feitas} questões)</span>
              </span>
            </div>
            <div className="subject-bar-track">
              <div
                className="subject-bar-fill"
                style={{
                  width: `${Math.min(100, Math.max(5, accuracy))}%`,
                  backgroundColor: fillColor
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SubjectTimeChart({ materias = [] }) {
  if (!materias.length) return null;

  const maxTime = Math.max(...materias.map(m => m.tempoMin), 1);

  return (
    <div className="chart-container">
      {materias.map((m, idx) => {
        const percent = ((m.tempoMin / maxTime) * 100).toFixed(0);
        return (
          <div key={idx} className="subject-bar-item">
            <div className="subject-bar-info">
              <span>{m.materia}</span>
              <span>{m.tempoFormatado}</span>
            </div>
            <div className="subject-bar-track">
              <div
                className="subject-bar-fill"
                style={{
                  width: `${Math.max(5, percent)}%`,
                  background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DailyEvolutionChart({ evolucao = [] }) {
  if (!evolucao.length) return <p className="metric-subtext">Sem registros recentes.</p>;

  const maxHoras = Math.max(...evolucao.map(e => parseFloat(e.tempoHoras)), 1);

  return (
    <div className="chart-container" style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "160px", paddingTop: "1rem" }}>
      {evolucao.slice(-10).map((item, idx) => {
        const heightPercent = Math.max(10, (parseFloat(item.tempoHoras) / maxHoras) * 100);
        return (
          <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-primary)" }}>
              {item.tempoHoras}h
            </span>
            <div
              style={{
                width: "100%",
                maxwidth: "32px",
                height: `${heightPercent}%`,
                background: "linear-gradient(180deg, var(--accent-primary), rgba(59, 130, 246, 0.3))",
                borderRadius: "var(--radius-sm)",
                transition: "height 0.4s ease"
              }}
              title={`${item.date}: ${item.tempoHoras}h de estudo e ${item.questoes} questões`}
            />
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", width: "100%", textAlign: "center" }}>
              {item.date.slice(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
