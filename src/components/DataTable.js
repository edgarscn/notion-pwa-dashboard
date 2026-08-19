import React, { useState, useMemo } from "react";

export default function DataTable({ records = [] }) {
  const [search, setSearch] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("TODAS");
  const [filterRendimento, setFilterRendimento] = useState("TODOS");
  const [sortBy, setSortBy] = useState("DATA_DESC");

  // Unique list of matérias for filter dropdown
  const materiasList = useMemo(() => {
    const list = Array.from(new Set(records.map(r => r.materia).filter(Boolean)));
    return ["TODAS", ...list.sort()];
  }, [records]);

  // Filtered and Sorted records
  const processedRecords = useMemo(() => {
    return records
      .map(r => {
        const baseQuestoes = r.totalQuestoes > 0 ? r.totalQuestoes : (r.feitas > 0 ? r.feitas : (r.acertos + r.erros));
        const taxaAcerto = baseQuestoes > 0 ? Math.round((r.acertos / baseQuestoes) * 100) : 0;
        return {
          ...r,
          baseQuestoes,
          taxaAcerto
        };
      })
      .filter(r => {
        // Filter by Matéria
        const matchMateria = selectedMateria === "TODAS" || r.materia === selectedMateria;

        // Filter by Rendimento status
        let matchRendimento = true;
        if (filterRendimento === "EXCELENTE") matchRendimento = r.taxaAcerto >= 80;
        else if (filterRendimento === "BOM") matchRendimento = r.taxaAcerto >= 70 && r.taxaAcerto < 80;
        else if (filterRendimento === "CRITICO") matchRendimento = r.taxaAcerto < 70;

        // Filter by Search Query
        const query = search.toLowerCase();
        const matchSearch =
          !search ||
          (r.materia && r.materia.toLowerCase().includes(query)) ||
          (r.conteudo && r.conteudo.toLowerCase().includes(query)) ||
          (r.assunto && r.assunto.toLowerCase().includes(query)) ||
          (r.aula && r.aula.toLowerCase().includes(query)) ||
          (r.observacoes && r.observacoes.toLowerCase().includes(query));

        return matchMateria && matchRendimento && matchSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "DATA_ASC":
            return a.dataCriacao.localeCompare(b.dataCriacao);
          case "DATA_DESC":
            return b.dataCriacao.localeCompare(a.dataCriacao);
          case "ACC_DESC":
            return b.taxaAcerto - a.taxaAcerto;
          case "ACC_ASC":
            return a.taxaAcerto - b.taxaAcerto;
          case "TIME_DESC":
            return b.tempoLiquidoMin - a.tempoLiquidoMin;
          case "QUESTOES_DESC":
            return b.baseQuestoes - a.baseQuestoes;
          case "MATERIA_ASC":
            return a.materia.localeCompare(b.materia);
          default:
            return b.dataCriacao.localeCompare(a.dataCriacao);
        }
      });
  }, [records, search, selectedMateria, filterRendimento, sortBy]);

  return (
    <div className="glass-card">
      <h3 className="section-title">
        <span>📖 Sessões de Estudo Registradas ({processedRecords.length})</span>
      </h3>

      {/* Controls & Filters Bar */}
      <div className="controls-bar" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {/* Search Input */}
        <div className="search-box" style={{ minWidth: "220px", flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar matéria, assunto, aula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter by Matéria */}
        <select
          className="filter-select"
          value={selectedMateria}
          onChange={e => setSelectedMateria(e.target.value)}
          title="Filtrar por Matéria"
        >
          {materiasList.map((m, idx) => (
            <option key={idx} value={m}>
              {m === "TODAS" ? "📚 Todas as Matérias" : m}
            </option>
          ))}
        </select>

        {/* Filter by Rendimento */}
        <select
          className="filter-select"
          value={filterRendimento}
          onChange={e => setFilterRendimento(e.target.value)}
          title="Filtrar por Rendimento %"
        >
          <option value="TODOS">🎯 Todos os Rendimentos</option>
          <option value="EXCELENTE">🟢 Excelente (≥ 80%)</option>
          <option value="BOM">🟡 Bom (70% - 79%)</option>
          <option value="CRITICO">🔴 Crítico (&lt; 70%)</option>
        </select>

        {/* Sort Dropdown */}
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          title="Ordenar por"
        >
          <option value="DATA_DESC">📅 Data (Mais recente)</option>
          <option value="DATA_ASC">📅 Data (Mais antiga)</option>
          <option value="ACC_DESC">🎯 Rendimento (Maior %)</option>
          <option value="ACC_ASC">🎯 Rendimento (Menor %)</option>
          <option value="TIME_DESC">⏱️ Tempo Líquido (Maior)</option>
          <option value="QUESTOES_DESC">📝 Total de Questões (Maior)</option>
          <option value="MATERIA_ASC">🔤 Matéria (A-Z)</option>
        </select>
      </div>

      {/* Table Display */}
      {processedRecords.length === 0 ? (
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
                <th>Questões (A / E / Feitas / Total)</th>
                <th>Taxa de Acerto</th>
                <th>Observações</th>
                <th>Notion</th>
              </tr>
            </thead>
            <tbody>
              {processedRecords.map(r => {
                const acc = r.taxaAcerto;
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
                      <span style={{ color: "var(--success)", fontWeight: 700 }} title="Acertos">{r.acertos} certas</span> /{" "}
                      <span style={{ color: "var(--danger)" }} title="Erros">{r.erros} erradas</span> /{" "}
                      <span style={{ color: "var(--accent-primary)" }} title="Feitas">{r.feitas} feitas</span> /{" "}
                      <span style={{ color: "var(--text-secondary)", fontWeight: 700 }} title="Total de Questões">{r.baseQuestoes} total</span>
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
