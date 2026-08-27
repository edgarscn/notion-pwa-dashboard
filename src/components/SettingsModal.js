import React, { useState } from "react";

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  isDemo,
  onToggleDemo
}) {
  const [notionKey, setNotionKey] = useState(config?.notionKey || "");
  const [databaseId, setDatabaseId] = useState(config?.databaseId || "");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notionKey.trim() || !databaseId.trim()) {
      setErrorMsg("Por favor, preencha tanto o Access Token quanto o ID/Link das Bases de Dados.");
      return;
    }

    // Extract all 32-hex Database IDs from pasted URLs or comma-separated string
    const inputStr = databaseId.trim();
    const matches = inputStr.match(/([a-f0-9]{32})/gi) || inputStr.match(/([a-f0-9-]{36})/gi);
    
    let cleanedDbIds = "";
    if (matches && matches.length > 0) {
      const uniqueIds = Array.from(new Set(matches.map(id => id.replace(/-/g, "").toLowerCase())));
      cleanedDbIds = uniqueIds.join(",");
    } else {
      cleanedDbIds = inputStr.replace(/-/g, "");
    }

    setErrorMsg("");
    onSaveConfig({ notionKey: notionKey.trim(), databaseId: cleanedDbIds });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>⚙️ Configurações da API do Notion</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>✖</button>
        </div>

        <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--accent-primary)" }}>
            💡 Conecte uma ou ambas as bases de dados (Histórico de Revisões + Blocos de estudo):
          </h4>
          <ol style={{ fontSize: "0.8rem", paddingLeft: "1.2rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <li>No Notion, abra a tabela (ex: <strong>Histórico de Revisões</strong>) &gt; <code>...</code> &gt; <strong>Copy link</strong>.</li>
            <li>Se quiser conectar as <strong>duas tabelas ao mesmo tempo</strong>, cole os dois links separados por vírgula no campo abaixo!</li>
            <li>Lembre-se de ir nas duas tabelas no Notion &gt; <code>...</code> &gt; <strong>Connections</strong> &gt; Adicionar <strong>Dashboard de Estudos</strong>.</li>
          </ol>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Access Token do Notion (`ntn_...` ou `secret_...`)</label>
            <input
              type="password"
              className="form-input"
              placeholder="Cole seu token: ntn_578953043424..."
              value={notionKey}
              onChange={e => setNotionKey(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ID(s) ou Link(s) das Bases de Dados (Cole links de ambas as bases separados por vírgula)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Cole os links das bases (ex: link_historico, link_blocos)"
              value={databaseId}
              onChange={e => setDatabaseId(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onToggleDemo();
                onClose();
              }}
            >
              {isDemo ? "Usar API do Notion" : "Ativar Modo Demo (Simulação)"}
            </button>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar e Conectar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
