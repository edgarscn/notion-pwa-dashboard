import React from "react";

export default function Header({
  isLive,
  isOffline,
  theme,
  lastSyncTime,
  autoSyncEnabled,
  onToggleAutoSync,
  onToggleTheme,
  onOpenSettings,
  onRefresh,
  onInstallPwa,
  canInstallPwa
}) {
  return (
    <header className="header-bar">
      <div className="header-brand">
        <div className="brand-icon">N</div>
        <div className="brand-text">
          <h1>Estudos Notion PWA</h1>
          <p>Dashboard Analítico para Concursos</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Network & Notion Status Badge */}
        {isOffline ? (
          <span className="badge badge-offline">
            <span className="status-dot"></span> Offline (Dados em Cache)
          </span>
        ) : isLive ? (
          <span
            className="badge badge-live"
            onClick={onToggleAutoSync}
            style={{ cursor: "pointer" }}
            title="Clique para alternar a sincronização automática em tempo real (30s)"
          >
            <span className="status-dot pulse"></span>{" "}
            {autoSyncEnabled ? "Sincronização em Tempo Real (30s)" : "Notion Conectado"}
          </span>
        ) : (
          <span className="badge badge-demo">
            <span className="status-dot"></span> Modo Demo (Simulação)
          </span>
        )}

        {/* Last Sync Timestamp */}
        {lastSyncTime && (
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.3rem 0.6rem", borderRadius: "var(--radius-full)" }}>
            🕒 {lastSyncTime}
          </span>
        )}

        {/* PWA Install Button if installable */}
        {canInstallPwa && (
          <button
            className="btn btn-primary"
            onClick={onInstallPwa}
            title="Instalar aplicativo PWA"
          >
            📥 Instalar PWA
          </button>
        )}

        {/* Refresh Button */}
        <button
          className="btn btn-secondary btn-icon"
          onClick={onRefresh}
          title="Sincronizar dados do Notion agora"
        >
          🔄
        </button>

        {/* Theme Toggle Button */}
        <button
          className="btn btn-secondary btn-icon"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Settings Button */}
        <button
          className="btn btn-secondary"
          onClick={onOpenSettings}
        >
          ⚙️ Configurações Notion
        </button>
      </div>
    </header>
  );
}
