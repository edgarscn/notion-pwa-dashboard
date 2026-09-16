import React, { useState, useEffect } from 'react';
import { Page, Teamspace } from '../../types';
import { PanelLeftOpen, Wifi, WifiOff, ChevronRight, Code2 } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTeamspace: Teamspace | null;
  activePage: Page | null;
  allPages: Page[];
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  activeTeamspace,
  activePage,
  allPages,
}) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Build breadcrumb trail
  const breadcrumbs: Page[] = [];
  let current: Page | undefined = activePage || undefined;

  while (current) {
    breadcrumbs.unshift(current);
    current = allPages.find((p) => p.id === current?.parentId);
  }

  return (
    <header className="h-12 border-b border-notion-border bg-white flex items-center justify-between px-4 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            title="Abrir Barra Lateral"
            className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors mr-2"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
          <span className="font-semibold text-gray-700 flex items-center gap-1">
            <span>{activeTeamspace?.icon || '🏢'}</span>
            <span className="truncate">{activeTeamspace?.name || 'Workspace'}</span>
          </span>

          {breadcrumbs.map((page) => (
            <React.Fragment key={page.id}>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="truncate flex items-center gap-1 font-medium text-notion-text">
                <span>{page.icon || (page.isDatabase ? '📋' : '📄')}</span>
                <span className="truncate">{page.title || 'Sem título'}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Header Status & GitHub Link */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Offline PWA Badge */}
        <div
          title={isOnline ? 'Conectado à Internet (PWA Ready)' : 'Modo Offline Ativo (Local-first Dexie.js)'}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>Online PWA</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-600" />
              <span>Offline Ready</span>
            </>
          )}
        </div>

        <a
          href="https://github.com/edgarscn/notion-pwa-dashboard"
          target="_blank"
          rel="noreferrer"
          className="p-1 rounded text-gray-500 hover:text-black hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Ver Repositório no GitHub"
        >
          <Code2 className="w-4 h-4 text-gray-700" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
};
