import React, { useState, useMemo } from "react";

/**
 * Clean Matéria name by stripping suffix terms like "Revisão", "Rev", "(Revisão)", "Exercícios"
 */
function cleanMateriaName(matStr = "") {
  if (!matStr) return "Geral";
  return matStr
    .replace(/\s*[\(\-\_]?\s*(revisão|revisao|rev|exercicios|exercícios|simulado|teoria)\b.*/gi, "")
    .trim() || matStr.trim();
}

/**
 * Format lesson/aula string into clean two-digit numbering (e.g. "1" -> "01", "01 revisão" -> "01")
 * Ignoring any extra suffix text ("Revisão", "Rev", etc.)
 */
function extractAulaNumber(aulaStr = "", conteudoStr = "") {
  const textToSearch = `${aulaStr || ""} ${conteudoStr || ""}`.trim();
  if (!textToSearch || textToSearch === "-") return "00";

  const digitsMatch = textToSearch.match(/\b\d+\b/) || textToSearch.match(/\d+/);
  if (digitsMatch) {
    const num = parseInt(digitsMatch[0], 10);
    return num < 10 ? `0${num}` : `${num}`;
  }
  return "00";
}

export function SubjectPerformanceChart({ records = [] }) {
  const [selectedMateria, setSelectedMateria] = useState("TODAS");
  const [filterNumeracao, setFilterNumeracao] = useState("");
  const [sortBy, setSortBy] = useState("NUMERACAO_ASC");

  // Group records strictly by Clean Matéria + Numbering (e.g. "Direito Administrativo 01")
  const items = useMemo(() => {
    if (!Array.isArray(records) || records.length === 0) return [];

    const groupedMap = {};

    records.forEach(r => {
      const mat = cleanMateriaName(r.materia || "Geral");
      const numStr = extractAulaNumber(r.aula, r.conteudo);
      const titleLabel = numStr && numStr !== "00" ? `${mat} ${numStr}` : mat;
      const baseQuestoes = r.totalQuestoes > 0 ? r.totalQuestoes : (r.feitas > 0 ? r.feitas : (r.acertos + r.erros));

      const key = `${mat.toLowerCase()}||${numStr}`;

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
        const matchMat = selectedMateria === "TODAS" || item.materia.toLowerCase() === selectedMateria.toLowerCase();
        const matchNum = !filterNumeracao.trim() || item.numStr.includes(filterNumeracao.trim());
        return matchMat && matchNum;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "NUMERACAO_ASC": {
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

/**
 * Portuguese Month Name Helper
 */
const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/**
 * Get start of week date string (Monday)
 */
function getWeekStartDateStr(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const dd = String(monday.getDate()).padStart(2, '0');
  return `${dd}/${mm}`;
}

/**
 * Daily / Weekly / Monthly Progress Chart Component
 */
export function DailyProgressChart({ records = [], evolucao = [] }) {
  const [granularity, setGranularity] = useState("DIA"); // "DIA" | "SEMANA" | "MES"

  // Aggregate liquid study hours based on chosen granularity
  const aggregatedData = useMemo(() => {
    const sourceRecords = (records && records.length > 0) ? records : [];

    if (sourceRecords.length > 0) {
      const map = {};

      sourceRecords.forEach(r => {
        const dateStr = r.dataCriacao || "Outras";
        const mins = r.tempoLiquidoMin || 0;

        let key = dateStr;
        let displayLabel = dateStr;

        if (granularity === "DIA") {
          key = dateStr;
          if (dateStr.includes("-")) {
            const parts = dateStr.split("-");
            if (parts.length === 3) displayLabel = `${parts[2]}/${parts[1]}`;
          }
        } else if (granularity === "SEMANA") {
          const weekStart = getWeekStartDateStr(dateStr);
          key = `Semana_${weekStart}`;
          displayLabel = `Sem ${weekStart}`;
        } else if (granularity === "MES") {
          const parts = dateStr.split("-");
          if (parts.length >= 2) {
            const yearShort = parts[0].slice(2);
            const monthIdx = parseInt(parts[1], 10) - 1;
            key = `${parts[0]}-${parts[1]}`;
            displayLabel = `${MONTH_NAMES[monthIdx] || parts[1]}/${yearShort}`;
          }
        }

        if (!map[key]) {
          map[key] = { key, displayLabel, rawDate: dateStr, tempoMin: 0, sessoes: 0 };
        }
        map[key].tempoMin += mins;
        map[key].sessoes += 1;
      });

      return Object.values(map)
        .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
        .map(item => ({
          ...item,
          tempoHoras: (item.tempoMin / 60).toFixed(1)
        }));
    }

    return evolucao.map(e => ({
      key: e.date,
      displayLabel: e.date.includes("-") ? `${e.date.split("-")[2]}/${e.date.split("-")[1]}` : e.date,
      tempoHoras: e.tempoHoras || (e.tempoMin / 60).toFixed(1)
    }));
  }, [records, evolucao, granularity]);

  if (!aggregatedData.length) {
    return <p className="metric-subtext">Sem registros de estudo recentes.</p>;
  }

  const maxHoras = Math.max(...aggregatedData.map(e => parseFloat(e.tempoHoras)), 1);
  const displayItems = aggregatedData.slice(granularity === "DIA" ? -14 : -12);

  return (
    <div>
      {/* Time Granularity Toggle Controls */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <div className="button-group" style={{ display: "flex", gap: "0.25rem", background: "var(--bg-secondary)", padding: "0.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <button
            className={`btn ${granularity === "DIA" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setGranularity("DIA")}
            style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
          >
            📅 Dia (Diário)
          </button>
          <button
            className={`btn ${granularity === "SEMANA" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setGranularity("SEMANA")}
            style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
          >
            🗓️ Semana
          </button>
          <button
            className={`btn ${granularity === "MES" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setGranularity("MES")}
            style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
          >
            📆 Mês
          </button>
        </div>
      </div>

      {/* Vertical Bar Chart */}
      <div className="chart-container" style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "170px", paddingTop: "1rem" }}>
        {displayItems.map((item, idx) => {
          const heightPercent = Math.max(10, (parseFloat(item.tempoHoras) / maxHoras) * 100);
          return (
            <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", height: "100%", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                {item.tempoHoras}h
              </span>
              <div
                style={{
                  width: "100%",
                  maxwidth: "36px",
                  height: `${heightPercent}%`,
                  background: "linear-gradient(180deg, var(--accent-primary), rgba(59, 130, 246, 0.3))",
                  borderRadius: "var(--radius-sm)",
                  transition: "height 0.4s ease"
                }}
                title={`${item.displayLabel}: ${item.tempoHoras}h líquidas`}
              />
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", width: "100%", textAlign: "center" }}>
                {item.displayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const DailyEvolutionChart = DailyProgressChart;
