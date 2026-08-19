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
      setErrorMsg("Por favor, preencha tanto a Chave da Integração quanto o ID da Base de Dados.");
      return;
    }
    setErrorMsg("");
    onSaveConfig({ notionKey: notionKey.trim(), databaseId: databaseId.trim() });
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
            💡 Como conectar com a sua base de dados do Notion:
          </h4>
          <ol style={{ fontSize: "0.8rem", paddingLeft: "1.2rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Acesse <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)" }}>notion.so/my-integrations</a> e crie uma nova integração.</li>
            <li>Copie o <strong>Internal Integration Token</strong> (começa com <code>secret_...</code>).</li>
            <li>Abra sua tabela de estudos no Notion, clique nos <code>...</code> no canto superior direito &gt; <strong>Connections</strong> e adicione sua integração.</li>
            <li>Copie o ID da base de dados contido na URL (32 caracteres entre a barra da URL e a interrogação).</li>
          </ol>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Chave de Integração Notion (Secret Token)</label>
            <input
              type="password"
              className="form-input"
              placeholder="secret_..."
              value={notionKey}
              onChange={e => setNotionKey(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ID da Base de Dados Notion (Database ID)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: 3a1f8b2c4e5d6a7b8c9d0e1f2a3b4c5d"
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
