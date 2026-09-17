import React, { useState, useMemo } from 'react';
import { Database, FilterGroup, RecordItem, SortRule } from '../../types';
import { updateDatabaseView } from '../../db/repository';
import { TableView } from './TableView';
import { BoardView } from './BoardView';
import { Table, LayoutGrid, Download, Upload, Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { exportToCSV, exportToXLSX } from '../../utils/importExport';
import { calculateRollupValue } from '../../utils/rollupEngine';
import { filterRecords, sortRecords } from '../../utils/filterSortEngine';
import { FilterModal } from './FilterModal';
import { SortModal } from './SortModal';

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

  // Filter, Sort, and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<FilterGroup>({
    conjunction: 'and',
    rules: [],
  });
  const [sortRules, setSortRules] = useState<SortRule[]>([]);

  // Modal open states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const handleToggleView = (view: 'table' | 'board') => {
    if (view !== currentView) {
      updateDatabaseView(database.id, view);
    }
  };

  // 1. Filter records
  const filteredRecords = useMemo(() => {
    return filterRecords(
      records,
      database.properties,
      filterGroup,
      searchQuery,
      allDatabases,
      allRecords
    );
  }, [records, database.properties, filterGroup, searchQuery, allDatabases, allRecords]);

  // 2. Sort filtered records
  const processedRecords = useMemo(() => {
    return sortRecords(
      filteredRecords,
      database.properties,
      sortRules,
      allDatabases,
      allRecords
    );
  }, [filteredRecords, database.properties, sortRules, allDatabases, allRecords]);

  const handleCalculateRollupForExport = (rec: RecordItem, prop: any) => {
    const relationProp = database.properties.find((p) => p.id === prop.rollupConfig?.relationPropertyId);
    const targetDbId = relationProp?.relationConfig?.targetDatabaseId;
    const targetDb = allDatabases.find((d) => d.id === targetDbId);
    const targetRecords = allRecords.filter((r) => r.databaseId === targetDbId);
    return calculateRollupValue(rec, prop.rollupConfig, targetRecords, targetDb?.properties || []);
  };

  return (
    <div className="space-y-4">
      {/* Views & Filter/Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-notion-border pb-3">
        {/* Left: View Switcher */}
        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg">
          <button
            onClick={() => handleToggleView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentView === 'table'
                ? 'bg-white text-blue-700 shadow-xs'
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
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Quadro Kanban</span>
          </button>
        </div>

        {/* Middle & Right: Search, Filter, Sort, Import/Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar registros..."
              className="pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg outline-none transition-all w-44 focus:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterGroup.rules.length > 0
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Filtro</span>
            {filterGroup.rules.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {filterGroup.rules.length}
              </span>
            )}
          </button>

          {/* Sort Button */}
          <button
            onClick={() => setIsSortModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortRules.length > 0
                ? 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600" />
            <span>Ordenar</span>
            {sortRules.length > 0 && (
              <span className="bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {sortRules.length}
              </span>
            )}
          </button>

          {/* Import & Export Toolbar Actions */}
          <div className="h-4 w-[1px] bg-gray-300 mx-1 hidden sm:block" />

          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span>Importar</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Exportar</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-notion-border rounded-lg shadow-lg z-30 min-w-[140px] py-1">
              <button
                onClick={() => exportToCSV(database, processedRecords, handleCalculateRollupForExport)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
              >
                Exportar CSV (.csv)
              </button>
              <button
                onClick={() => exportToXLSX(database, processedRecords, handleCalculateRollupForExport)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
              >
                Exportar Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search summary bar if active */}
      {(filterGroup.rules.length > 0 || sortRules.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center justify-between bg-blue-50/50 border border-blue-100 px-3 py-2 rounded-lg text-xs">
          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <span className="font-semibold text-gray-700">
              Exibindo {processedRecords.length} de {records.length} registros:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-medium">
                Busca: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filterGroup.rules.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-medium">
                {filterGroup.rules.length} filtro(s) ativo(s)
                <button
                  onClick={() => setFilterGroup({ conjunction: 'and', rules: [] })}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortRules.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-white border border-purple-200 text-purple-800 px-2 py-0.5 rounded-md font-medium">
                {sortRules.length} ordenação(ões) ativa(s)
                <button onClick={() => setSortRules([])} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterGroup({ conjunction: 'and', rules: [] });
              setSortRules([]);
            }}
            className="text-[11px] text-gray-500 hover:text-blue-700 font-semibold underline"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* View Content */}
      {currentView === 'table' ? (
        <TableView
          database={database}
          records={processedRecords}
          allDatabases={allDatabases}
          allRecords={allRecords}
        />
      ) : (
        <BoardView
          database={database}
          records={processedRecords}
          allDatabases={allDatabases}
          allRecords={allRecords}
        />
      )}

      {/* Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        properties={database.properties}
        filterGroup={filterGroup}
        onChangeFilterGroup={setFilterGroup}
      />

      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        properties={database.properties}
        sortRules={sortRules}
        onChangeSortRules={setSortRules}
      />
    </div>
  );
};
