import React, { useState } from 'react';
import { Database, RecordItem, PropertySchema, PropertyType } from '../../types';
import { createRecord, deleteRecord } from '../../db/repository';
import { CellEditor } from './CellEditor';
import { PropertyHeaderModal } from './PropertyHeaderModal';
import { evaluateFormula } from '../../utils/formulaEngine';
import { formatNumber } from '../../utils/formatters';
import {
  Plus,
  Trash2,
  Settings2,
  Type,
  Hash,
  Tag,
  CheckCircle2,
  Calendar,
  Link2,
  Layers,
  Calculator,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface TableViewProps {
  database: Database;
  records: RecordItem[];
  allDatabases: Database[];
  allRecords: RecordItem[];
}

const getPropIcon = (type: PropertyType) => {
  switch (type) {
    case 'text': return <Type className="w-3.5 h-3.5 text-gray-400" />;
    case 'number': return <Hash className="w-3.5 h-3.5 text-blue-400" />;
    case 'select': return <Tag className="w-3.5 h-3.5 text-purple-400" />;
    case 'status': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case 'date': return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
    case 'relation': return <Link2 className="w-3.5 h-3.5 text-indigo-400" />;
    case 'rollup': return <Layers className="w-3.5 h-3.5 text-orange-400" />;
    case 'formula': return <Calculator className="w-3.5 h-3.5 text-cyan-400" />;
    case 'created_time': return <Clock className="w-3.5 h-3.5 text-gray-400" />;
    default: return <Type className="w-3.5 h-3.5 text-gray-400" />;
  }
};

const CALC_OPTIONS = [
  { id: 'none', label: 'Nenhum' },
  { id: 'count_all', label: 'Contar todos' },
  { id: 'count_values', label: 'Contar preenchidos' },
  { id: 'count_unique', label: 'Contar únicos' },
  { id: 'count_empty', label: 'Contar vazios' },
  { id: 'percent_empty', label: '% Vazios' },
  { id: 'percent_not_empty', label: '% Preenchidos' },
  { id: 'sum', label: 'Soma' },
  { id: 'average', label: 'Média' },
  { id: 'min', label: 'Mínimo' },
  { id: 'max', label: 'Máximo' },
  { id: 'range', label: 'Intervalo' },
];

export const TableView: React.FC<TableViewProps> = ({
  database,
  records,
  allDatabases,
  allRecords,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertySchema | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [openCalcDropdownPropId, setOpenCalcDropdownPropId] = useState<string | null>(null);

  // Column Calculations State (Default preset for study metrics)
  const [columnCalculations, setColumnCalculations] = useState<Record<string, string>>({
    'p-feitas': 'sum',
    'p-acertos': 'sum',
    'p-erros': 'sum',
    'p-em-branco': 'sum',
    'p-total-questoes': 'sum',
    'p-tempo': 'sum',
    'p-taxa': 'average',
    'p-taxa-cespe': 'average',
  });

  const handleAddRow = async () => {
    await createRecord(database.id);
  };

  const handleDeleteRow = async (recId: string) => {
    await deleteRecord(recId);
  };

  const handleOpenNewPropModal = () => {
    setSelectedProperty(null);
    setShowPropertyModal(true);
  };

  const handleOpenEditPropModal = (prop: PropertySchema) => {
    setSelectedProperty(prop);
    setShowPropertyModal(true);
  };

  const handleSelectCalc = (propId: string, calcId: string) => {
    setColumnCalculations((prev) => ({ ...prev, [propId]: calcId }));
    setOpenCalcDropdownPropId(null);
  };

  // Compute aggregate value for a column calculation
  const computeCalcValue = (prop: PropertySchema): string => {
    const calcType = columnCalculations[prop.id];
    if (!calcType || calcType === 'none') return '';

    const values = records.map((r) => {
      if (prop.type === 'formula') {
        return evaluateFormula(prop.formulaConfig?.expression || '', r, database.properties);
      }
      return r.values[prop.id];
    });

    const total = records.length;
    const validVals = values.filter((v) => v !== undefined && v !== null && v !== '' && v !== 'N/A');

    if (calcType === 'count_all') return `Total ${total}`;
    if (calcType === 'count_values') return `Preenchidos ${validVals.length}`;
    if (calcType === 'count_unique') return `Únicos ${new Set(validVals).size}`;
    if (calcType === 'count_empty') return `Vazios ${total - validVals.length}`;
    if (calcType === 'percent_empty') {
      const emptyCount = total - validVals.length;
      return `Vazios ${total > 0 ? Math.round((emptyCount / total) * 100) : 0}%`;
    }
    if (calcType === 'percent_not_empty') {
      return `Preenchidos ${total > 0 ? Math.round((validVals.length / total) * 100) : 0}%`;
    }

    // Numeric calculations
    const numericVals = values
      .map((v) => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          const clean = v.replace('%', '').trim();
          const num = Number(clean);
          return isNaN(num) ? null : num;
        }
        return null;
      })
      .filter((v): v is number => v !== null);

    if (numericVals.length === 0) return '';

    const sum = numericVals.reduce((acc, curr) => acc + curr, 0);

    if (calcType === 'sum') {
      const isPercent = String(values.find((v) => String(v).includes('%')) || '').includes('%');
      const formatted = formatNumber(Math.round(sum * 10) / 10, prop.numberFormat);
      return `Soma ${formatted}${isPercent ? '%' : ''}`;
    }

    if (calcType === 'average') {
      const isPercent = String(values.find((v) => String(v).includes('%')) || '').includes('%');
      const avg = Math.round((sum / numericVals.length) * 10) / 10;
      return `Média ${avg}${isPercent ? '%' : ''}`;
    }

    if (calcType === 'min') {
      const min = Math.min(...numericVals);
      return `Mín ${min}`;
    }

    if (calcType === 'max') {
      const max = Math.max(...numericVals);
      return `Máx ${max}`;
    }

    if (calcType === 'range') {
      const range = Math.max(...numericVals) - Math.min(...numericVals);
      return `Intervalo ${Math.round(range * 10) / 10}`;
    }

    return '';
  };

  return (
    <div className="w-full overflow-x-auto border border-notion-border rounded-xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-notion-border bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {database.properties.map((prop) => (
              <th
                key={prop.id}
                onClick={() => handleOpenEditPropModal(prop)}
                className="px-3 py-2.5 border-r border-notion-border cursor-pointer hover:bg-gray-100 transition-colors group select-none min-w-[140px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getPropIcon(prop.type)}
                    <span className="truncate">{prop.name}</span>
                  </div>
                  <Settings2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
            ))}
            <th className="px-3 py-2.5 border-r border-notion-border w-12 text-center">
              <button
                onClick={handleOpenNewPropModal}
                title="Adicionar Coluna"
                className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </th>
            <th className="w-10 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-notion-border text-xs">
          {records.map((rec) => (
            <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors group">
              {database.properties.map((prop) => (
                <td key={prop.id} className="p-1 border-r border-notion-border align-middle">
                  <CellEditor
                    record={rec}
                    property={prop}
                    database={database}
                    allDatabases={allDatabases}
                    allRecords={allRecords}
                  />
                </td>
              ))}
              <td className="border-r border-notion-border" />
              <td className="px-2 text-center align-middle">
                <button
                  onClick={() => handleDeleteRow(rec.id)}
                  title="Excluir Linha"
                  className="p-1 rounded text-gray-300 group-hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        {/* Notion Column Calculation Row (Calcular) */}
        <tfoot>
          <tr className="border-t border-notion-border bg-gray-50/80 text-xs font-medium text-gray-500">
            {database.properties.map((prop) => {
              const calcVal = computeCalcValue(prop);
              const isDropdownOpen = openCalcDropdownPropId === prop.id;

              return (
                <td
                  key={prop.id}
                  className="px-2 py-1.5 border-r border-notion-border relative select-none"
                >
                  <button
                    onClick={() =>
                      setOpenCalcDropdownPropId(isDropdownOpen ? null : prop.id)
                    }
                    className="w-full text-right hover:bg-gray-200/60 px-1.5 py-1 rounded text-xs font-semibold text-gray-600 flex items-center justify-end gap-1 transition-colors group"
                  >
                    <span>{calcVal || 'Calcular'}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-700" />
                  </button>

                  {/* Calculation Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 bottom-full mb-1 bg-white border border-notion-border rounded-xl shadow-xl z-40 py-1 w-44 animate-fade-in text-left">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase text-gray-400 border-b border-gray-100">
                        Calcular ({prop.name})
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {CALC_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectCalc(prop.id, opt.id)}
                            className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                              columnCalculations[prop.id] === opt.id
                                ? 'bg-blue-50 text-blue-700 font-bold'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              );
            })}
            <td className="border-r border-notion-border" />
            <td />
          </tr>
        </tfoot>
      </table>

      {/* Add Row Button */}
      <div className="p-2 border-t border-notion-border bg-gray-50/40 flex items-center justify-between">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo registro</span>
        </button>
        <span className="text-xs text-gray-400 font-mono pr-2">
          {records.length} registros
        </span>
      </div>

      <PropertyHeaderModal
        isOpen={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        database={database}
        allDatabases={allDatabases}
        property={selectedProperty}
      />
    </div>
  );
};
