import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Table, FileText } from 'lucide-react';
import { Page } from '../../types';
import { createPage, deletePage } from '../../db/repository';

interface PageTreeItemProps {
  page: Page;
  allPages: Page[];
  activePageId: string | null;
  onSelectPage: (pageId: string) => void;
  level?: number;
}

export const PageTreeItem: React.FC<PageTreeItemProps> = ({
  page,
  allPages,
  activePageId,
  onSelectPage,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const children = allPages.filter((p) => p.parentId === page.id);
  const isActive = activePageId === page.id;

  const handleAddSubpage = async (e: React.MouseEvent, isDb: boolean) => {
    e.stopPropagation();
    setIsExpanded(true);
    const title = isDb ? 'Nova Base de Dados' : 'Nova Subpágina';
    const icon = isDb ? '📋' : '📄';
    const newPage = await createPage(page.teamspaceId, page.id, title, isDb, icon);
    onSelectPage(newPage.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Excluir "${page.title}" e todas as suas subpáginas?`)) {
      await deletePage(page.id);
    }
  };

  return (
    <div className="select-none">
      <div
        onClick={() => onSelectPage(page.id)}
        style={{ paddingLeft: `${level * 14 + 8}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 rounded-md cursor-pointer text-xs font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-semibold'
            : 'text-notion-text hover:bg-notion-hover'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span className="text-sm shrink-0">{page.icon || (page.isDatabase ? '📋' : '📄')}</span>
          <span className="truncate">{page.title || 'Sem título'}</span>
        </div>

        <div className="hidden group-hover:flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => handleAddSubpage(e, false)}
            title="Adicionar Subpágina"
            className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleAddSubpage(e, true)}
            title="Adicionar Base de Dados"
            className="p-1 rounded text-gray-400 hover:text-purple-600 hover:bg-purple-100 transition-colors"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            title="Excluir Página"
            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isExpanded && children.length > 0 && (
        <div className="mt-0.5">
          {children.map((childPage) => (
            <PageTreeItem
              key={childPage.id}
              page={childPage}
              allPages={allPages}
              activePageId={activePageId}
              onSelectPage={onSelectPage}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
