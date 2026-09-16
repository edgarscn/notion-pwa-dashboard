import React, { useState } from 'react';
import { Database, RecordItem, PropertySchema } from '../../types';
import { createRecord, updateRecordCell, deleteRecord } from '../../db/repository';
import { Badge } from '../common/Badge';
import { evaluateFormula } from '../../utils/formulaEngine';
import { calculateRollupValue } from '../../utils/rollupEngine';
import { formatNumber, formatDate } from '../../utils/formatters';
import { Plus, Trash2, Calendar, Layers, Calculator, MoveRight } from 'lucide-react';

interface BoardViewProps {
  database: Database;
  records: RecordItem[];
  allDatabases: Database[];
  allRecords: RecordItem[];
}

export const BoardView: React.FC<BoardViewProps> = ({
  database,
  records,
  allDatabases,
  allRecords,
}) => {
  // Find group-by property (status or select)
  const groupableProps = database.properties.filter(
    (p) => p.type === 'status' || p.type === 'select'
  );
  const [groupByPropId, setGroupByPropId] = useState<string>(
    groupableProps[0]?.id || ''
  );

  const groupByProp = database.properties.find((p) => p.id === groupByPropId) || groupableProps[0];
  const columns = groupByProp?.options || [
    { id: 'opt-default-1', name: 'A Fazer', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { id: 'opt-default-2', name: 'Em Andamento', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { id: 'opt-default-3', name: 'Concluído', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  ];

  const titleProp = database.properties.find((p) => p.type === 'text') || database.properties[0];

  const handleAddCard = async (colName: string) => {
    if (!groupByProp) return;
    await createRecord(database.id, {
      [groupByProp.id]: colName,
    });
  };

  const handleMoveCard = async (recId: string, targetColName: string) => {
    if (!groupByProp) return;
    await updateRecordCell(recId, groupByProp.id, targetColName);
  };

  return (
    <div className="space-y-4">
      {/* Group By Selector */}
      {groupableProps.length > 1 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Agrupar por:</span>
          <select
            value={groupByPropId}
            onChange={(e) => setGroupByPropId(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md bg-white text-notion-text font-medium focus:outline-none"
          >
            {groupableProps.map((gp) => (
              <option key={gp.id} value={gp.id}>
                {gp.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const colRecords = records.filter((r) => {
            const val = r.values[groupByProp?.id || ''];
            return val === col.name || val === col.id;
          });

          return (
            <div
              key={col.id}
              className="bg-gray-50/70 rounded-xl p-3 border border-notion-border flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Badge label={col.name} color={col.color} />
                  <span className="text-xs font-semibold text-gray-400">
                    {colRecords.length}
                  </span>
                </div>
                <button
                  onClick={() => handleAddCard(col.name)}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards List */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {colRecords.map((rec) => {
                  const cardTitle = titleProp ? rec.values[titleProp.id] || 'Sem título' : 'Sem título';

                  return (
                    <div
                      key={rec.id}
                      className="bg-white p-3.5 rounded-lg border border-notion-border shadow-sm hover:shadow transition-shadow group relative"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-notion-text leading-snug">
                          {cardTitle}
                        </h4>
                        <button
                          onClick={() => deleteRecord(rec.id)}
                          title="Excluir Cartão"
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-600 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Visible Card Properties */}
                      <div className="space-y-1.5 pt-1 border-t border-gray-100">
                        {database.properties.map((prop) => {
                          if (prop.id === titleProp?.id || prop.id === groupByProp?.id) return null;
                          const val = rec.values[prop.id];

                          if (prop.type === 'select' || prop.type === 'status') {
                            const opt = prop.options?.find((o) => o.id === val || o.name === val);
                            if (!opt) return null;
                            return (
                              <div key={prop.id} className="flex items-center gap-1.5">
                                <Badge label={opt.name} color={opt.color} />
                              </div>
                            );
                          }

                          if (prop.type === 'number' && val !== undefined && val !== null && val !== '') {
                            return (
                              <div key={prop.id} className="text-xs text-gray-500 font-mono">
                                <span className="font-medium text-gray-400">{prop.name}:</span>{' '}
                                {formatNumber(val, prop.numberFormat)}
                              </div>
                            );
                          }

                          if (prop.type === 'date' && val) {
                            return (
                              <div key={prop.id} className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Calendar className="w-3 h-3 text-amber-500" />
                                <span>{formatDate(val)}</span>
                              </div>
                            );
                          }

                          if (prop.type === 'formula') {
                            const formulaVal = evaluateFormula(prop.formulaConfig?.expression || '', rec, database.properties);
                            if (!formulaVal) return null;
                            return (
                              <div key={prop.id} className="flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50/50 px-1.5 py-0.5 rounded w-fit">
                                <Calculator className="w-3 h-3 text-blue-500" />
                                <span>{String(formulaVal)}</span>
                              </div>
                            );
                          }

                          if (prop.type === 'rollup') {
                            const relationProp = database.properties.find((p) => p.id === prop.rollupConfig?.relationPropertyId);
                            const targetDbId = relationProp?.relationConfig?.targetDatabaseId;
                            const targetDb = allDatabases.find((d) => d.id === targetDbId);
                            const targetRecords = allRecords.filter((r) => r.databaseId === targetDbId);
                            const rollupVal = calculateRollupValue(rec, prop.rollupConfig, targetRecords, targetDb?.properties || []);
                            if (!rollupVal) return null;
                            return (
                              <div key={prop.id} className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                                <Layers className="w-3 h-3 text-amber-600" />
                                <span>{String(rollupVal)}</span>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>

                      {/* Move Column Quick Action */}
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>Mover para:</span>
                        <div className="flex gap-1">
                          {columns.map((c) => {
                            if (c.name === col.name) return null;
                            return (
                              <button
                                key={c.id}
                                onClick={() => handleMoveCard(rec.id, c.name)}
                                title={`Mover para ${c.name}`}
                                className="px-1.5 py-0.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded text-gray-600 font-medium transition-colors"
                              >
                                {c.name.slice(0, 8)}...
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Card Footer Button */}
              <button
                onClick={() => handleAddCard(col.name)}
                className="mt-2 py-1.5 px-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors w-full"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Cartão</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
