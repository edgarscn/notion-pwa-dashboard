import React from "react";

export default function CriticalTopics({ materiasCriticas = [] }) {
  if (!materiasCriticas || materiasCriticas.length === 0) {
    return (
      <div className="glass-card" style={{ height: "100%" }}>
        <h3 className="section-title">
          <span>⚠️ Alertas de Revisão</span>
        </h3>
        <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--success)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
          <p style={{ fontWeight: 700 }}>Excelente rendimento!</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Todas as matérias estão acima de 75% de acertos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ height: "100%" }}>
      <h3 className="section-title">
        <span>⚠️ Matérias Críticas (Reforço Urgente)</span>
      </h3>
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        Matérias com taxa de acerto inferior a 75%. Priorize estas disciplinas no seu ciclo de revisões.
      </p>

      <div className="critical-list">
        {materiasCriticas.map((m, idx) => (
          <div key={idx} className="critical-item">
            <div>
              <div className="critical-item-title">{m.materia}</div>
              <div className="critical-item-sub">
                {m.erros} erros em {m.feitas} questões ({m.tempoFormatado} estudados)
              </div>
            </div>
            <div className="critical-badge">{m.taxaAcerto}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
