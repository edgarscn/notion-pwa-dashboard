import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { seedInitialData } from '../../db/seed';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageHeader } from '../pages/PageHeader';
import { StandardPage } from '../pages/StandardPage';
import { DatabaseView } from '../database/DatabaseView';
import { ImportModal } from '../io/ImportModal';
import { Loader2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTeamspaceId, setActiveTeamspaceId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // Seed on initial boot
  useEffect(() => {
    async function init() {
      await seedInitialData();
      setIsDbLoaded(true);
    }
    init();
  }, []);

  // Live Queries from Dexie.js
  const teamspaces = useLiveQuery(() => db.teamspaces.toArray(), []);
  const pages = useLiveQuery(() => db.pages.toArray(), []);
  const databases = useLiveQuery(() => db.databases.toArray(), []);
  const records = useLiveQuery(() => db.records.toArray(), []);

  // Set default active teamspace & page when data loads
  useEffect(() => {
    if (teamspaces && teamspaces.length > 0 && !activeTeamspaceId) {
      setActiveTeamspaceId(teamspaces[0].id);
    }
  }, [teamspaces, activeTeamspaceId]);

  useEffect(() => {
    if (pages && activeTeamspaceId) {
      const activeTsPages = pages.filter((p) => p.teamspaceId === activeTeamspaceId);
      if (activeTsPages.length > 0) {
        // If current active page is not in active teamspace, reset to first root page
        const isCurrentInTs = activeTsPages.some((p) => p.id === activePageId);
        if (!isCurrentInTs) {
          setActivePageId(activeTsPages[0].id);
        }
      } else {
        setActivePageId(null);
      }
    }
  }, [pages, activeTeamspaceId, activePageId]);

  if (!isDbLoaded || !teamspaces || !pages || !databases || !records) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Inicializando Workspace Notion PWA...</p>
      </div>
    );
  }

  const activeTeamspace = teamspaces.find((t) => t.id === activeTeamspaceId) || teamspaces[0] || null;
  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || null;

  const activeDatabase = activePage?.isDatabase
    ? databases.find((d) => d.pageId === activePage.id) || null
    : null;

  const databaseRecords = activeDatabase
    ? records.filter((r) => r.databaseId === activeDatabase.id)
    : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-notion-text">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          teamspaces={teamspaces}
          activeTeamspace={activeTeamspace}
          onSelectTeamspace={(tsId) => setActiveTeamspaceId(tsId)}
          pages={pages}
          activePageId={activePageId}
          onSelectPage={(pId) => setActivePageId(pId)}
          onToggleSidebar={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(true)}
          activeTeamspace={activeTeamspace}
          activePage={activePage}
          allPages={pages}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 max-w-6xl mx-auto w-full">
          {activePage ? (
            <div>
              <PageHeader page={activePage} />

              {activePage.isDatabase && activeDatabase ? (
                <DatabaseView
                  database={activeDatabase}
                  records={databaseRecords}
                  allDatabases={databases}
                  allRecords={records}
                  onOpenImport={() => setShowImportModal(true)}
                />
              ) : (
                <StandardPage page={activePage} />
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <p className="text-sm">Nenhuma página selecionada.</p>
            </div>
          )}
        </main>
      </div>

      {activeTeamspace && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          teamspaceId={activeTeamspace.id}
          currentDatabase={activeDatabase}
          onImportCompleted={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};
