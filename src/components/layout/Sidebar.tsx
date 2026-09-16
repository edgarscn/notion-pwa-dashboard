import React, { useState } from 'react';
import { Teamspace, Page } from '../../types';
import { PageTreeItem } from '../pages/PageTreeItem';
import { createPage, createTeamspace } from '../../db/repository';
import { TeamspaceModal } from '../teamspace/TeamspaceModal';
import { Plus, ChevronDown, Table, FileText, Search, Settings, PanelLeftClose } from 'lucide-react';

interface SidebarProps {
  teamspaces: Teamspace[];
  activeTeamspace: Teamspace | null;
  onSelectTeamspace: (teamspaceId: string) => void;
  pages: Page[];
  activePageId: string | null;
  onSelectPage: (pageId: string) => void;
  onToggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  teamspaces,
  activeTeamspace,
  onSelectTeamspace,
  pages,
  activePageId,
  onSelectPage,
  onToggleSidebar,
}) => {
  const [showTeamspaceDropdown, setShowTeamspaceDropdown] = useState(false);
  const [showTeamspaceModal, setShowTeamspaceModal] = useState(false);
  const [editingTeamspace, setEditingTeamspace] = useState<Teamspace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter root pages for active teamspace
  const rootPages = pages.filter(
    (p) =>
      p.teamspaceId === activeTeamspace?.id &&
      p.parentId === null &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRootPage = async (isDb: boolean) => {
    if (!activeTeamspace) return;
    const title = isDb ? 'Nova Base de Dados' : 'Nova Página';
    const icon = isDb ? '📋' : '📄';
    const newPage = await createPage(activeTeamspace.id, null, title, isDb, icon);
    onSelectPage(newPage.id);
  };

  const handleSaveTeamspace = async (name: string, icon: string, description?: string) => {
    if (editingTeamspace) {
      const { updateTeamspace } = await import('../../db/repository');
      await updateTeamspace(editingTeamspace.id, { name, icon, description });
    } else {
      const ts = await createTeamspace(name, icon);
      onSelectTeamspace(ts.id);
    }
    setEditingTeamspace(null);
  };

  return (
    <aside className="w-64 bg-notion-sidebar border-r border-notion-border flex flex-col h-screen select-none shrink-0 transition-all">
      {/* Teamspace Header */}
      <div className="p-3 border-b border-notion-border relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowTeamspaceDropdown(!showTeamspaceDropdown)}
            className="flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-notion-hover transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{activeTeamspace?.icon || '🏢'}</span>
              <div className="text-left truncate">
                <h2 className="text-xs font-bold text-notion-text truncate">
                  {activeTeamspace?.name || 'Workspace'}
                </h2>
                <p className="text-[10px] text-notion-muted">Teamspace PWA</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
          </button>

          <button
            onClick={onToggleSidebar}
            title="Recolher Barra Lateral"
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-notion-hover ml-1 shrink-0"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Teamspace Selector Dropdown */}
        {showTeamspaceDropdown && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-notion-border rounded-xl shadow-xl z-40 py-1.5 animate-fade-in">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400">
              Seus Teamspaces
            </div>

            {teamspaces.map((ts) => (
              <div
                key={ts.id}
                onClick={() => {
                  onSelectTeamspace(ts.id);
                  setShowTeamspaceDropdown(false);
                }}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                  activeTeamspace?.id === ts.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-notion-text hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{ts.icon}</span>
                  <span className="truncate">{ts.name}</span>
                </div>
              </div>
            ))}

            <div className="border-t border-gray-100 mt-1 pt-1 px-1">
              <button
                onClick={() => {
                  setEditingTeamspace(null);
                  setShowTeamspaceModal(true);
                  setShowTeamspaceDropdown(false);
                }}
                className="w-full text-left px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Novo Teamspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Search Bar */}
      <div className="p-3 pb-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar páginas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-notion-border rounded-lg bg-white/70 focus:outline-none focus:ring-1 focus:ring-blue-500 text-notion-text placeholder-gray-400"
          />
        </div>
      </div>

      {/* Navigation Page Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-notion-muted">
          <span>Páginas & Tabelas</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCreateRootPage(false)}
              title="Nova Página"
              className="p-1 rounded hover:bg-notion-hover text-gray-400 hover:text-gray-700"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCreateRootPage(true)}
              title="Nova Base de Dados"
              className="p-1 rounded hover:bg-notion-hover text-purple-500 hover:text-purple-700"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {rootPages.length === 0 ? (
          <p className="px-3 py-2 text-xs text-gray-400 italic">Nenhuma página encontrada.</p>
        ) : (
          rootPages.map((page) => (
            <PageTreeItem
              key={page.id}
              page={page}
              allPages={pages}
              activePageId={activePageId}
              onSelectPage={onSelectPage}
            />
          ))
        )}
      </div>

      {/* Add Page Footer Button */}
      <div className="p-3 border-t border-notion-border bg-notion-sidebar">
        <button
          onClick={() => handleCreateRootPage(false)}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-notion-muted hover:text-notion-text hover:bg-notion-hover rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Página</span>
        </button>
      </div>

      <TeamspaceModal
        isOpen={showTeamspaceModal}
        onClose={() => setShowTeamspaceModal(false)}
        onSave={handleSaveTeamspace}
        teamspace={editingTeamspace}
      />
    </aside>
  );
};
