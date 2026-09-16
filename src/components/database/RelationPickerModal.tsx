import React from 'react';
import { Modal } from '../common/Modal';
import { RecordItem, Database, PropertySchema } from '../../types';
import { updateRecordCell } from '../../db/repository';

interface RelationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: RecordItem;
  property: PropertySchema;
  targetDatabase: Database;
  targetRecords: RecordItem[];
}

export const RelationPickerModal: React.FC<RelationPickerModalProps> = ({
  isOpen,
  onClose,
  record,
  property,
  targetDatabase,
  targetRecords,
}) => {
  const currentLinkedIds: string[] = record.values[property.id] || [];

  // Find primary title property of target database
  const titleProp = targetDatabase.properties.find((p) => p.type === 'text') || targetDatabase.properties[0];

  const handleToggleRecord = async (targetRecId: string) => {
    let updatedIds: string[];
    if (currentLinkedIds.includes(targetRecId)) {
      updatedIds = currentLinkedIds.filter((id) => id !== targetRecId);
    } else {
      updatedIds = [...currentLinkedIds, targetRecId];
    }
    await updateRecordCell(record.id, property.id, updatedIds);

    // Sync reciprocal relation on target record if configured
    if (property.relationConfig?.targetPropertyId) {
      const reciprocalPropId = property.relationConfig.targetPropertyId;
      const targetRec = targetRecords.find((tr) => tr.id === targetRecId);
      if (targetRec) {
        const targetLinked: string[] = targetRec.values[reciprocalPropId] || [];
        const isLinked = currentLinkedIds.includes(targetRecId);
        let newTargetLinked: string[];
        if (isLinked) {
          newTargetLinked = targetLinked.filter((id) => id !== record.id);
        } else {
          newTargetLinked = Array.from(new Set([...targetLinked, record.id]));
        }
        await updateRecordCell(targetRecId, reciprocalPropId, newTargetLinked);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vincular a ${targetDatabase.title}`}
    >
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <p className="text-xs text-gray-500 mb-3">
          Selecione os registros da base de dados "{targetDatabase.title}" para relacionar a este item:
        </p>

        {targetRecords.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nenhum registro encontrado nesta base de dados.</p>
        ) : (
          targetRecords.map((tr) => {
            const label = tr.values[titleProp.id] || 'Sem título';
            const isSelected = currentLinkedIds.includes(tr.id);
            return (
              <div
                key={tr.id}
                onClick={() => handleToggleRecord(tr.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 text-blue-900 font-medium'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{label}</span>
                </div>
                {isSelected && (
                  <span className="text-xs text-blue-600 font-semibold uppercase">Vinculado</span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Concluído
        </button>
      </div>
    </Modal>
  );
};
