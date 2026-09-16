import React from 'react';
import { Database, RecordItem } from '../../types';
import { updateDatabaseView } from '../../db/repository';
import { TableView } from './TableView';
import { BoardView } from './BoardView';
import { Table, LayoutGrid, Download, Upload } from 'lucide-react';
import { exportToCSV, exportToXLSX } from '../../utils/importExport';
import { calculateRollupValue } from '../../utils/rollupEngine';

interface DatabaseViewProps {
  database: Database;
  records: RecordItem[];
  allDatabases: Database[];
  allRecords: RecordItem[];
  onOpenImport: () => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  database,
  records,
  allDatabases,
  allRecords,
  onOpenImport,
}) => {
  const currentView = database.defaultView || 'table';

  const handleToggleView = (view: 'table' | 'board') => {
    if (view !== currentView) {
      updateDatabaseView(database.id, view);
    }
  };

  const handleCalculateRollupForExport = (rec: RecordItem, prop: any) => {
    const relationProp = database.properties.find((p) => p.id === prop.rollupConfig?.relationPropertyId);
    const targetDbId = relationProp?.relationConfig?.targetDatabaseId;
    const targetDb = allDatabases.find((d) => d.id === targetDbId);
    const targetRecords = allRecords.filter((r) => r.databaseId === targetDbId);
    return calculateRollupValue(rec, prop.rollupConfig, targetRecords, targetDb?.properties || []);
  };

  return (
    <div className="space-y-4">
      {/* Views Switcher Toolbar */}
      <div className="flex items-center justify-between border-b border-notion-border pb-3">
        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg">
          <button
            onClick={() => handleToggleView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentView === 'table'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
          <button
            onClick={() => handleToggleView('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentView === 'board'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Quadro Kanban</span>
          </button>
        </div>

        {/* Import & Export Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span>Importar (CSV/XLSX)</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Exportar</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-notion-border rounded-lg shadow-lg z-30 min-w-[140px] py-1">
              <button
                onClick={() => exportToCSV(database, records, handleCalculateRollupForExport)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
              >
                Exportar CSV (.csv)
              </button>
              <button
                onClick={() => exportToXLSX(database, records, handleCalculateRollupForExport)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
              >
                Exportar Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Content */}
      {currentView === 'table' ? (
        <TableView
          database={database}
          records={records}
          allDatabases={allDatabases}
          allRecords={allRecords}
        />
      ) : (
        <BoardView
          database={database}
          records={records}
          allDatabases={allDatabases}
          allRecords={allRecords}
        />
      )}
    </div>
  );
};
