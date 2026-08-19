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
      setErrorMsg("Por favor, preencha tanto o Access Token quanto o ID da Base de Dados.");
      return;
    }

    // Clean Database ID if user pasted full Notion URL
    let cleanedDbId = databaseId.trim();
    if (cleanedDbId.includes("notion.so")) {
      const parts = cleanedDbId.split("?")[0].split("/");
      const lastPart = parts[parts.length - 1];
      const match = lastPart.match(/([a-f0-9]{32})/i) || lastPart.match(/([a-f0-9-]{36})/i);
      if (match) {
        cleanedDbId = match[1].replace(/-/g, "");
      } else {
        cleanedDbId = lastPart.replace(/-/g, "");
      }
    } else {
      cleanedDbId = cleanedDbId.replace(/-/g, "");
    }

    setErrorMsg("");
    onSaveConfig({ notionKey: notionKey.trim(), databaseId: cleanedDbId });
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
            💡 Como pegar o ID da sua tabela (ex: "Histórico de Revisões" ou "Blocos de estudo"):
          </h4>
          <ol style={{ fontSize: "0.8rem", paddingLeft: "1.2rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <li>Clique na tabela desejada no Notion (ex: <strong>Histórico de Revisões</strong> ou <strong>Blocos de estudo</strong>).</li>
            <li>No canto superior direito da página, clique nos <code>...</code> &gt; <strong>Copy link</strong> (ou copie o link da barra de navegação).</li>
            <li>Cole o link completo no campo <strong>ID da Base de Dados</strong> abaixo (o sistema extrai o ID automaticamente!).</li>
            <li>Lembre-se de clicar nos <code>...</code> da tabela no Notion &gt; <strong>Connections</strong> &gt; Adicionar <strong>Dashboard de Estudos</strong>.</li>
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
            <label className="form-label">ID ou Link da Base de Dados (ex: Histórico de Revisões)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Cole o ID (32 caracteres) ou o Link completo da tabela no Notion"
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
