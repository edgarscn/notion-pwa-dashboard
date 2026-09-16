import React, { useState } from 'react';
import { PropertySchema, RecordItem, Database } from '../../types';
import { updateRecordCell } from '../../db/repository';
import { Badge } from '../common/Badge';
import { evaluateFormula } from '../../utils/formulaEngine';
import { calculateRollupValue } from '../../utils/rollupEngine';
import { formatNumber, formatDate, formatDateTime } from '../../utils/formatters';
import { RelationPickerModal } from './RelationPickerModal';
import { Calendar, Link2, Calculator, Layers } from 'lucide-react';

interface CellEditorProps {
  record: RecordItem;
  property: PropertySchema;
  database: Database;
  allDatabases: Database[];
  allRecords: RecordItem[];
}

export const CellEditor: React.FC<CellEditorProps> = ({
  record,
  property,
  database,
  allDatabases,
  allRecords,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showRelationModal, setShowRelationModal] = useState(false);

  const rawVal = record.values[property.id];

  const handleCellBlur = (value: any) => {
    updateRecordCell(record.id, property.id, value);
    setIsEditing(false);
  };

  // 1. TEXT
  if (property.type === 'text') {
    if (isEditing) {
      return (
        <input
          type="text"
          defaultValue={rawVal || ''}
          autoFocus
          onBlur={(e) => handleCellBlur(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCellBlur(e.currentTarget.value);
          }}
          className="w-full px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none"
        />
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 min-h-[30px] flex items-center text-xs text-notion-text cursor-pointer hover:bg-gray-100/60 rounded transition-colors"
      >
        <span className={rawVal ? '' : 'text-gray-300 italic'}>
          {rawVal || 'Vazio'}
        </span>
      </div>
    );
  }

  // 2. NUMBER
  if (property.type === 'number') {
    if (isEditing) {
      return (
        <input
          type="number"
          step="any"
          defaultValue={rawVal !== undefined && rawVal !== null ? rawVal : ''}
          autoFocus
          onBlur={(e) => {
            const num = e.target.value === '' ? null : Number(e.target.value);
            handleCellBlur(num);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const num = e.currentTarget.value === '' ? null : Number(e.currentTarget.value);
              handleCellBlur(num);
            }
          }}
          className="w-full px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none"
        />
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 min-h-[30px] flex items-center text-xs font-mono text-notion-text cursor-pointer hover:bg-gray-100/60 rounded transition-colors"
      >
        <span className={rawVal !== undefined && rawVal !== null && rawVal !== '' ? '' : 'text-gray-300 italic'}>
          {rawVal !== undefined && rawVal !== null && rawVal !== ''
            ? formatNumber(rawVal, property.numberFormat)
            : 'Vazio'}
        </span>
      </div>
    );
  }

  // 3. SELECT & STATUS
  if (property.type === 'select' || property.type === 'status') {
    const selectedOption = property.options?.find((o) => o.id === rawVal || o.name === rawVal);

    if (isEditing) {
      return (
        <select
          defaultValue={selectedOption ? selectedOption.name : ''}
          autoFocus
          onBlur={(e) => handleCellBlur(e.target.value)}
          onChange={(e) => handleCellBlur(e.target.value)}
          className="w-full px-1 py-1 text-xs border border-blue-500 rounded focus:outline-none bg-white"
        >
          <option value="">Nenhum</option>
          {property.options?.map((opt) => (
            <option key={opt.id} value={opt.name}>
              {opt.name}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 min-h-[30px] flex items-center cursor-pointer hover:bg-gray-100/60 rounded transition-colors"
      >
        {selectedOption ? (
          <Badge label={selectedOption.name} color={selectedOption.color} />
        ) : (
          <span className="text-xs text-gray-300 italic">Selecione...</span>
        )}
      </div>
    );
  }

  // 4. DATE
  if (property.type === 'date') {
    if (isEditing) {
      return (
        <input
          type="date"
          defaultValue={rawVal || ''}
          autoFocus
          onBlur={(e) => handleCellBlur(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none"
        />
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 min-h-[30px] flex items-center gap-1.5 text-xs text-notion-text cursor-pointer hover:bg-gray-100/60 rounded transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <span className={rawVal ? '' : 'text-gray-300 italic'}>
          {formatDate(rawVal) || 'Sem data'}
        </span>
      </div>
    );
  }

  // 5. CREATED TIME (Editable as requested!)
  if (property.type === 'created_time') {
    if (isEditing) {
      const formattedInputVal = rawVal ? new Date(rawVal).toISOString().slice(0, 16) : '';
      return (
        <input
          type="datetime-local"
          defaultValue={formattedInputVal}
          autoFocus
          onBlur={(e) => {
            const dateStr = e.target.value ? new Date(e.target.value).toISOString() : rawVal;
            handleCellBlur(dateStr);
          }}
          className="w-full px-2 py-1 text-xs border border-blue-500 rounded focus:outline-none"
        />
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 min-h-[30px] flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer hover:bg-gray-100/60 rounded transition-colors"
        title="Clique para alterar a data de criação manualmente"
      >
        <Calendar className="w-3.5 h-3.5 text-blue-500" />
        <span>{formatDateTime(rawVal) || 'Sem data'}</span>
      </div>
    );
  }

  // 6. RELATION
  if (property.type === 'relation') {
    const targetDbId = property.relationConfig?.targetDatabaseId;
    const targetDb = allDatabases.find((d) => d.id === targetDbId);
    const linkedIds: string[] = Array.isArray(rawVal) ? rawVal : [];

    const targetRecords = allRecords.filter((r) => r.databaseId === targetDbId);
    const linkedRecords = targetRecords.filter((r) => linkedIds.includes(r.id));

    const targetTitleProp = targetDb?.properties.find((p) => p.type === 'text') || targetDb?.properties[0];

    return (
      <>
        <div
          onClick={() => setShowRelationModal(true)}
          className="px-2 py-1 min-h-[30px] flex items-center flex-wrap gap-1 cursor-pointer hover:bg-gray-100/60 rounded transition-colors"
        >
          {linkedRecords.length > 0 ? (
            linkedRecords.map((lr) => {
              const label = targetTitleProp ? lr.values[targetTitleProp.id] || 'Registro' : 'Registro';
              return (
                <Badge
                  key={lr.id}
                  label={label}
                  color="bg-purple-50 text-purple-700 border-purple-200"
                />
              );
            })
          ) : (
            <span className="text-xs text-gray-300 italic flex items-center gap-1">
              <Link2 className="w-3 h-3" /> Vincular...
            </span>
          )}
        </div>

        {targetDb && (
          <RelationPickerModal
            isOpen={showRelationModal}
            onClose={() => setShowRelationModal(false)}
            record={record}
            property={property}
            targetDatabase={targetDb}
            targetRecords={targetRecords}
          />
        )}
      </>
    );
  }

  // 7. ROLLUP
  if (property.type === 'rollup') {
    const rollupConfig = property.rollupConfig;
    const relationProp = database.properties.find((p) => p.id === rollupConfig?.relationPropertyId);
    const targetDbId = relationProp?.relationConfig?.targetDatabaseId;

    const targetDb = allDatabases.find((d) => d.id === targetDbId);
    const targetRecords = allRecords.filter((r) => r.databaseId === targetDbId);
    const targetProperties = targetDb?.properties || [];

    const rollupVal = calculateRollupValue(record, rollupConfig, targetRecords, targetProperties);

    return (
      <div className="px-2 py-1 min-h-[30px] flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50/50 rounded border border-amber-100/50">
        <Layers className="w-3 h-3 text-amber-500 shrink-0" />
        <span className="truncate">{rollupVal !== undefined && rollupVal !== '' ? String(rollupVal) : '0'}</span>
      </div>
    );
  }

  // 8. FORMULA
  if (property.type === 'formula') {
    const formulaExpr = property.formulaConfig?.expression || '';
    const formulaVal = evaluateFormula(formulaExpr, record, database.properties);
    const isError = formulaVal === '#ERRO!';

    return (
      <div
        className={`px-2 py-1 min-h-[30px] flex items-center gap-1 text-xs font-mono rounded border ${
          isError
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-blue-50/40 text-blue-900 border-blue-100/40'
        }`}
      >
        <Calculator className="w-3 h-3 text-blue-500 shrink-0" />
        <span className="truncate">{formulaVal !== undefined ? String(formulaVal) : ''}</span>
      </div>
    );
  }

  return <div className="px-2 py-1 text-xs text-gray-400">-</div>;
};
