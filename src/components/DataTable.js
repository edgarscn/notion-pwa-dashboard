import React, { useState, useMemo } from "react";

export default function DataTable({ records = [] }) {
  const [search, setSearch] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("TODAS");

  // Get unique list of matérias for filter dropdown
  const materiasList = useMemo(() => {
    const list = Array.from(new Set(records.map(r => r.materia).filter(Boolean)));
    return ["TODAS", ...list.sort()];
  }, [records]);

  // Filtered records based on search and subject filter
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchMateria = selectedMateria === "TODAS" || r.materia === selectedMateria;
      const query = search.toLowerCase();
      const matchSearch =
        !search ||
        (r.materia && r.materia.toLowerCase().includes(query)) ||
        (r.conteudo && r.conteudo.toLowerCase().includes(query)) ||
        (r.assunto && r.assunto.toLowerCase().includes(query)) ||
        (r.aula && r.aula.toLowerCase().includes(query)) ||
        (r.observacoes && r.observacoes.toLowerCase().includes(query));

      return matchMateria && matchSearch;
    });
  }, [records, search, selectedMateria]);

  return (
    <div className="glass-card">
      <h3 className="section-title">
        <span>📖 Sestões de Estudo Registradas ({filteredRecords.length})</span>
      </h3>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por matéria, conteúdo, assunto ou aula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={selectedMateria}
          onChange={e => setSelectedMateria(e.target.value)}
        >
          {materiasList.map((m, idx) => (
            <option key={idx} value={m}>
              {m === "TODAS" ? "Todas as Matérias" : m}
            </option>
          ))}
        </select>
      </div>

      {/* Table Display */}
      {filteredRecords.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
          Nenhum registro encontrado para os filtros selecionados.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Matéria</th>
                <th>Aula</th>
                <th>Conteúdo & Assunto</th>
                <th>Tempo Líquido</th>
                <th>Questões (A/E/T)</th>
                <th>Rendimento</th>
                <th>Observações</th>
                <th>Notion</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => {
                const acc = r.feitas > 0 ? Math.round((r.acertos / r.feitas) * 100) : 0;
                let accClass = "metric-trend-high";
                if (acc < 70) accClass = "metric-trend-low";
                else if (acc < 80) accClass = "metric-trend-mid";

                return (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                      {r.dataCriacao}
                    </td>
                    <td>
                      <span className="tag-materia">{r.materia}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.aula}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{r.conteudo}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {r.assunto}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {r.tempoLiquidoMin ? `${Math.floor(r.tempoLiquidoMin / 60)}h ${r.tempoLiquidoMin % 60}m` : "-"}
                    </td>
                    <td>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>{r.acertos}</span> /{" "}
                      <span style={{ color: "var(--danger)" }}>{r.erros}</span> /{" "}
                      <span style={{ color: "var(--text-secondary)" }}>{r.feitas}</span>
                    </td>
                    <td>
                      <span className={`badge ${accClass}`} style={{ background: "rgba(255,255,255,0.05)" }}>
                        {acc}%
                      </span>
                    </td>
                    <td style={{ maxWidth: "220px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {r.observacoes || "-"}
                    </td>
                    <td>
                      {r.url && r.url !== "#" ? (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--accent-primary)", textDecoration: "none" }}
                          title="Abrir no Notion"
                        >
                          🔗 Notion
                        </a>
                      ) : (
                        <span style={{ opacity: 0.4 }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
