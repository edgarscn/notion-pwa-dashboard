import React, { useState, useMemo } from "react";

/**
 * Format lesson/aula string into clean two-digit numbering (e.g. "1" -> "01", "Aula 7" -> "07")
 */
function formatAulaNumber(aulaStr = "") {
  if (!aulaStr || aulaStr === "-") return "";
  const str = String(aulaStr).trim();
  const digitsMatch = str.match(/\d+/);
  if (digitsMatch) {
    const num = parseInt(digitsMatch[0], 10);
    return num < 10 ? `0${num}` : `${num}`;
  }
  return str;
}

export function SubjectPerformanceChart({ records = [] }) {
  const [selectedMateria, setSelectedMateria] = useState("TODAS");
  const [filterNumeracao, setFilterNumeracao] = useState("");
  const [sortBy, setSortBy] = useState("NUMERACAO_ASC");

  // Group records by Matéria + Numeração (e.g. "Direito Penal 01")
  const items = useMemo(() => {
    if (!Array.isArray(records) || records.length === 0) return [];

    const groupedMap = {};

    records.forEach(r => {
      const mat = r.materia || "Geral";
      const numStr = formatAulaNumber(r.aula);
      const titleLabel = numStr ? `${mat} ${numStr}` : mat;
      const baseQuestoes = r.totalQuestoes > 0 ? r.totalQuestoes : (r.feitas > 0 ? r.feitas : (r.acertos + r.erros));

      const key = `${mat}||${numStr}`;

      if (!groupedMap[key]) {
        groupedMap[key] = {
          key,
          materia: mat,
          numStr: numStr || "00",
          titleLabel,
          acertos: 0,
          erros: 0,
          feitas: 0,
          baseQuestoes: 0
        };
      }

      groupedMap[key].acertos += r.acertos || 0;
      groupedMap[key].erros += r.erros || 0;
      groupedMap[key].feitas += r.feitas || 0;
      groupedMap[key].baseQuestoes += baseQuestoes;
    });

    return Object.values(groupedMap).map(item => {
      const taxaAcerto = item.baseQuestoes > 0 ? parseFloat(((item.acertos / item.baseQuestoes) * 100).toFixed(1)) : 0;
      return {
        ...item,
        taxaAcerto
      };
    });
  }, [records]);

  // Extract unique Matérias for filter dropdown
  const materiasList = useMemo(() => {
    const setMat = new Set(items.map(i => i.materia));
    return ["TODAS", ...Array.from(setMat).sort()];
  }, [items]);

  // Filter & Sort Items
  const processedItems = useMemo(() => {
    return items
      .filter(item => {
        const matchMat = selectedMateria === "TODAS" || item.materia === selectedMateria;
        const matchNum = !filterNumeracao.trim() || item.numStr.includes(filterNumeracao.trim());
        return matchMat && matchNum;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "NUMERACAO_ASC": {
            // Sort alphabetically by materia first, then numerically by numStr ascending
            const matCmp = a.materia.localeCompare(b.materia);
            if (matCmp !== 0) return matCmp;
            return a.numStr.localeCompare(b.numStr, undefined, { numeric: true });
          }
          case "NUMERACAO_DESC": {
            const matCmp = b.materia.localeCompare(a.materia);
            if (matCmp !== 0) return matCmp;
            return b.numStr.localeCompare(a.numStr, undefined, { numeric: true });
          }
          case "ACC_ASC":
            return a.taxaAcerto - b.taxaAcerto;
          case "ACC_DESC":
            return b.taxaAcerto - a.taxaAcerto;
          default:
            return a.materia.localeCompare(b.materia);
        }
      });
  }, [items, selectedMateria, filterNumeracao, sortBy]);

  if (!records.length) {
    return <p className="metric-subtext">Nenhum dado de matéria disponível.</p>;
  }

  return (
    <div>
      {/* Controls: Filter by Matéria, Numeração, Sort Order */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {/* Filter by Matéria */}
        <select
          className="filter-select"
          value={selectedMateria}
          onChange={e => setSelectedMateria(e.target.value)}
          style={{ flex: 1, minWidth: "160px", padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
        >
          {materiasList.map((m, idx) => (
            <option key={idx} value={m}>
              {m === "TODAS" ? "📚 Todas as Matérias" : m}
            </option>
          ))}
        </select>

        {/* Filter by Numeração */}
        <input
          type="text"
          className="search-input"
          placeholder="Filtrar numeração (ex: 01)..."
          value={filterNumeracao}
          onChange={e => setFilterNumeracao(e.target.value)}
          style={{ width: "160px", padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
        />

        {/* Sort Order */}
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ minWidth: "170px", padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
        >
          <option value="NUMERACAO_ASC">🔢 Numeração (Crescente ↑)</option>
          <option value="NUMERACAO_DESC">🔢 Numeração (Decrescente ↓)</option>
          <option value="ACC_DESC">🎯 Taxa de Acerto (Maior ↓)</option>
          <option value="ACC_ASC">🎯 Taxa de Acerto (Menor ↑)</option>
        </select>
      </div>

      {/* Bar Chart Display */}
      {processedItems.length === 0 ? (
        <p className="metric-subtext" style={{ textAlign: "center", padding: "1rem" }}>
          Nenhum resultado encontrado para os filtros selecionados.
        </p>
      ) : (
        <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {processedItems.map((item, idx) => {
            const accuracy = item.taxaAcerto;
            let fillColor = "var(--success)";
            if (accuracy < 70) fillColor = "var(--danger)";
            else if (accuracy < 80) fillColor = "var(--warning)";

            return (
              <div key={idx} className="subject-bar-item">
                <div className="subject-bar-info">
                  <span style={{ fontWeight: 700 }}>{item.titleLabel}</span>
                  <span>
                    <strong style={{ color: fillColor }}>{accuracy}%</strong>{" "}
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>
                      ({item.acertos}/{item.baseQuestoes} questões)
                    </span>
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
      )}
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
