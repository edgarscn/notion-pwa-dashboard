import React, { useState } from 'react';
import { Database, RecordItem, PropertySchema, PropertyType } from '../../types';
import { createRecord, deleteRecord } from '../../db/repository';
import { CellEditor } from './CellEditor';
import { PropertyHeaderModal } from './PropertyHeaderModal';
import { Plus, Trash2, Settings2, Type, Hash, Tag, CheckCircle2, Calendar, Link2, Layers, Calculator, Clock } from 'lucide-react';

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

export const TableView: React.FC<TableViewProps> = ({
  database,
  records,
  allDatabases,
  allRecords,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertySchema | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

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
      </table>

      {/* Add Row Button */}
      <div className="p-2 border-t border-notion-border bg-gray-50/40">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo registro</span>
        </button>
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
