import React from 'react';
import { PropertySchema, SortDirection, SortRule } from '../../types';
import { X, Plus, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertySchema[];
  sortRules: SortRule[];
  onChangeSortRules: (rules: SortRule[]) => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  isOpen,
  onClose,
  properties,
  sortRules,
  onChangeSortRules,
}) => {
  if (!isOpen) return null;

  const handleAddRule = () => {
    // Find first property not already in sortRules
    const unusedProp = properties.find((p) => !sortRules.some((r) => r.propertyId === p.id));
    const targetProp = unusedProp || properties[0];
    if (!targetProp) return;

    const newRule: SortRule = {
      id: `sort-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      propertyId: targetProp.id,
      direction: 'asc',
    };

    onChangeSortRules([...sortRules, newRule]);
  };

  const handleRemoveRule = (ruleId: string) => {
    onChangeSortRules(sortRules.filter((r) => r.id !== ruleId));
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<SortRule>) => {
    onChangeSortRules(sortRules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
  };

  const handleClearAll = () => {
    onChangeSortRules([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div
        className="bg-white rounded-xl shadow-2xl border border-notion-border w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-notion-border bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
            <ArrowUpDown className="w-4 h-4 text-purple-600" />
            <span>Ordenação Multi-colunas</span>
            {sortRules.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {sortRules.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {sortRules.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-lg">
              Nenhuma ordenação aplicada nesta visualização.
            </div>
          ) : (
            <div className="space-y-3">
              {sortRules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 bg-gray-50/80 p-2.5 rounded-lg border border-gray-200 text-xs"
                >
                  <span className="text-[10px] font-bold text-gray-400 w-5 text-center">
                    {idx + 1}º
                  </span>

                  {/* Property Selector */}
                  <select
                    value={rule.propertyId}
                    onChange={(e) => handleUpdateRule(rule.id, { propertyId: e.target.value })}
                    className="flex-1 bg-white border border-gray-300 rounded-md px-2.5 py-1.5 font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.name}
                      </option>
                    ))}
                  </select>

                  {/* Direction Switcher */}
                  <div className="flex items-center bg-white border border-gray-300 rounded-md p-0.5">
                    <button
                      onClick={() => handleUpdateRule(rule.id, { direction: 'asc' })}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                        rule.direction === 'asc'
                          ? 'bg-purple-100 text-purple-700 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                      title="Crescente (A -> Z, 0 -> 9)"
                    >
                      <ArrowUp className="w-3 h-3" />
                      <span>Crescente</span>
                    </button>
                    <button
                      onClick={() => handleUpdateRule(rule.id, { direction: 'desc' })}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                        rule.direction === 'desc'
                          ? 'bg-purple-100 text-purple-700 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                      title="Decrescente (Z -> A, 9 -> 0)"
                    >
                      <ArrowDown className="w-3 h-3" />
                      <span>Decrescente</span>
                    </button>
                  </div>

                  {/* Remove rule */}
                  <button
                    onClick={() => handleRemoveRule(rule.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                    title="Remover ordenação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-notion-border bg-gray-50/50">
          <button
            onClick={handleAddRule}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar ordenação</span>
          </button>

          <div className="flex items-center gap-2">
            {sortRules.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-md transition-colors"
              >
                Limpar ordenação
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
