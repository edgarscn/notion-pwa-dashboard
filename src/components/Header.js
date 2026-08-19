import React from "react";

export default function Header({
  isLive,
  isOffline,
  theme,
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
          <span className="badge badge-live">
            <span className="status-dot pulse"></span> Notion API Ao Vivo
          </span>
        ) : (
          <span className="badge badge-demo">
            <span className="status-dot"></span> Modo Demo (Simulação)
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
          title="Atualizar dados"
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
