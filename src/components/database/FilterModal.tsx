import React from 'react';
import { FilterConjunction, FilterGroup, FilterOperator, FilterRule, PropertySchema } from '../../types';
import { X, Plus, Trash2, SlidersHorizontal } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertySchema[];
  filterGroup: FilterGroup;
  onChangeFilterGroup: (group: FilterGroup) => void;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'É igual a',
  not_equals: 'Não é igual a',
  contains: 'Contém',
  not_contains: 'Não contém',
  starts_with: 'Começa com',
  ends_with: 'Termina com',
  greater_than: 'Maior que (>)',
  less_than: 'Menor que (<)',
  greater_than_or_equal: 'Maior ou igual (≥)',
  less_than_or_equal: 'Menor ou igual (≤)',
  is_empty: 'Está vazio',
  is_not_empty: 'Não está vazio',
};

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  properties,
  filterGroup,
  onChangeFilterGroup,
}) => {
  if (!isOpen) return null;

  const handleAddRule = () => {
    const firstProp = properties[0];
    if (!firstProp) return;

    const newRule: FilterRule = {
      id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      propertyId: firstProp.id,
      operator: 'contains',
      value: '',
    };

    onChangeFilterGroup({
      ...filterGroup,
      rules: [...filterGroup.rules, newRule],
    });
  };

  const handleRemoveRule = (ruleId: string) => {
    onChangeFilterGroup({
      ...filterGroup,
      rules: filterGroup.rules.filter((r) => r.id !== ruleId),
    });
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<FilterRule>) => {
    onChangeFilterGroup({
      ...filterGroup,
      rules: filterGroup.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
    });
  };

  const handleToggleConjunction = (conjunction: FilterConjunction) => {
    onChangeFilterGroup({
      ...filterGroup,
      conjunction,
    });
  };

  const handleClearAll = () => {
    onChangeFilterGroup({
      conjunction: 'and',
      rules: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
      <div
        className="bg-white rounded-xl shadow-2xl border border-notion-border w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-notion-border bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filtros Múltiplos</span>
            {filterGroup.rules.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {filterGroup.rules.length}
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
          {/* Conjunction toggle */}
          {filterGroup.rules.length > 1 && (
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit text-xs">
              <span className="text-gray-500 px-2 font-medium">Corresponder a:</span>
              <button
                onClick={() => handleToggleConjunction('and')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterGroup.conjunction === 'and'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Todas as regras (E)
              </button>
              <button
                onClick={() => handleToggleConjunction('or')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterGroup.conjunction === 'or'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Qualquer regra (OU)
              </button>
            </div>
          )}

          {/* Rules List */}
          {filterGroup.rules.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-lg">
              Nenhum filtro aplicado nesta visualização.
            </div>
          ) : (
            <div className="space-y-3">
              {filterGroup.rules.map((rule, idx) => {
                const selectedProp = properties.find((p) => p.id === rule.propertyId);
                const isNoValueOperator = rule.operator === 'is_empty' || rule.operator === 'is_not_empty';

                return (
                  <div
                    key={rule.id}
                    className="flex items-center gap-2 bg-gray-50/80 p-2.5 rounded-lg border border-gray-200 text-xs"
                  >
                    {/* Index or conjunction tag */}
                    <span className="text-[10px] font-bold text-gray-400 w-6 text-center">
                      {idx === 0 ? 'Onde' : filterGroup.conjunction === 'and' ? 'E' : 'OU'}
                    </span>

                    {/* Property Selector */}
                    <select
                      value={rule.propertyId}
                      onChange={(e) =>
                        handleUpdateRule(rule.id, {
                          propertyId: e.target.value,
                          value: '',
                        })
                      }
                      className="bg-white border border-gray-300 rounded-md px-2 py-1.5 font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[150px]"
                    >
                      {properties.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name}
                        </option>
                      ))}
                    </select>

                    {/* Operator Selector */}
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleUpdateRule(rule.id, {
                          operator: e.target.value as FilterOperator,
                        })
                      }
                      className="bg-white border border-gray-300 rounded-md px-2 py-1.5 font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {selectedProp?.type === 'number' ? (
                        <>
                          <option value="equals">{OPERATOR_LABELS.equals}</option>
                          <option value="not_equals">{OPERATOR_LABELS.not_equals}</option>
                          <option value="greater_than">{OPERATOR_LABELS.greater_than}</option>
                          <option value="less_than">{OPERATOR_LABELS.less_than}</option>
                          <option value="greater_than_or_equal">
                            {OPERATOR_LABELS.greater_than_or_equal}
                          </option>
                          <option value="less_than_or_equal">
                            {OPERATOR_LABELS.less_than_or_equal}
                          </option>
                          <option value="is_empty">{OPERATOR_LABELS.is_empty}</option>
                          <option value="is_not_empty">{OPERATOR_LABELS.is_not_empty}</option>
                        </>
                      ) : (
                        <>
                          <option value="contains">{OPERATOR_LABELS.contains}</option>
                          <option value="not_contains">{OPERATOR_LABELS.not_contains}</option>
                          <option value="equals">{OPERATOR_LABELS.equals}</option>
                          <option value="not_equals">{OPERATOR_LABELS.not_equals}</option>
                          <option value="starts_with">{OPERATOR_LABELS.starts_with}</option>
                          <option value="ends_with">{OPERATOR_LABELS.ends_with}</option>
                          <option value="is_empty">{OPERATOR_LABELS.is_empty}</option>
                          <option value="is_not_empty">{OPERATOR_LABELS.is_not_empty}</option>
                        </>
                      )}
                    </select>

                    {/* Value Input */}
                    {!isNoValueOperator && (
                      <div className="flex-1 min-w-[120px]">
                        {selectedProp?.options && selectedProp.options.length > 0 ? (
                          <select
                            value={rule.value}
                            onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">-- Selecionar opção --</option>
                            {selectedProp.options.map((opt) => (
                              <option key={opt.id} value={opt.name}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={selectedProp?.type === 'number' ? 'number' : 'text'}
                            value={rule.value ?? ''}
                            onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                            placeholder="Valor..."
                            className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    )}

                    {/* Delete Rule */}
                    <button
                      onClick={() => handleRemoveRule(rule.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Remover filtro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-notion-border bg-gray-50/50">
          <button
            onClick={handleAddRule}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar filtro</span>
          </button>

          <div className="flex items-center gap-2">
            {filterGroup.rules.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-md transition-colors"
              >
                Limpar filtros
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
