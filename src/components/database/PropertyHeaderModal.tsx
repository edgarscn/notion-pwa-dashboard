import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Database, PropertySchema, PropertyType, NumberFormat, RollupFunction, SelectOption } from '../../types';
import { addPropertyToDatabase, updatePropertyInDatabase, deletePropertyFromDatabase } from '../../db/repository';
import { Badge } from '../common/Badge';

interface PropertyHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: Database;
  allDatabases: Database[];
  property?: PropertySchema | null; // Null if adding new
}

const PROPERTY_TYPES: { type: PropertyType; label: string; desc: string }[] = [
  { type: 'text', label: 'Texto', desc: 'Texto simples ou longo' },
  { type: 'number', label: 'Número', desc: 'Valores numéricos e moedas' },
  { type: 'select', label: 'Seleção', desc: 'Opção única com tags coloridas' },
  { type: 'status', label: 'Status', desc: 'Estados de progresso e fluxo' },
  { type: 'date', label: 'Data', desc: 'Seletor de data ISO' },
  { type: 'relation', label: 'Relação', desc: 'Vínculo com outra base de dados' },
  { type: 'rollup', label: 'Rollup', desc: 'Agregação sobre dados vinculados' },
  { type: 'formula', label: 'Fórmula', desc: 'Campo calculado com expressões' },
  { type: 'created_time', label: 'Data de Criação', desc: 'Timestamp de registro editável' },
];

const BADGE_COLORS = [
  'bg-gray-100 text-gray-700 border-gray-300',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-emerald-100 text-emerald-700 border-emerald-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-amber-100 text-amber-700 border-amber-300',
  'bg-red-100 text-red-700 border-red-300',
  'bg-indigo-100 text-indigo-700 border-indigo-300',
];

export const PropertyHeaderModal: React.FC<PropertyHeaderModalProps> = ({
  isOpen,
  onClose,
  database,
  allDatabases,
  property,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<PropertyType>('text');
  const [numberFormat, setNumberFormat] = useState<NumberFormat>('number');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [newOptionName, setNewOptionName] = useState('');

  // Relation config
  const [targetDatabaseId, setTargetDatabaseId] = useState('');

  // Rollup config
  const [rollupRelationId, setRollupRelationId] = useState('');
  const [rollupTargetPropId, setRollupTargetPropId] = useState('');
  const [rollupFunction, setRollupFunction] = useState<RollupFunction>('count');

  // Formula config
  const [formulaExpr, setFormulaExpr] = useState('');

  useEffect(() => {
    if (property) {
      setName(property.name);
      setType(property.type);
      setNumberFormat(property.numberFormat || 'number');
      setOptions(property.options || []);
      setTargetDatabaseId(property.relationConfig?.targetDatabaseId || '');
      setRollupRelationId(property.rollupConfig?.relationPropertyId || '');
      setRollupTargetPropId(property.rollupConfig?.targetPropertyId || '');
      setRollupFunction(property.rollupConfig?.function || 'count');
      setFormulaExpr(property.formulaConfig?.expression || '');
    } else {
      setName('');
      setType('text');
      setNumberFormat('number');
      setOptions([]);
      setTargetDatabaseId('');
      setRollupRelationId('');
      setRollupTargetPropId('');
      setRollupFunction('count');
      setFormulaExpr('');
    }
  }, [property, isOpen]);

  // Relation options in this DB
  const relationProperties = database.properties.filter((p) => p.type === 'relation');
  const selectedRollupRelationProp = database.properties.find((p) => p.id === rollupRelationId);
  const targetDbForRollup = allDatabases.find(
    (d) => d.id === selectedRollupRelationProp?.relationConfig?.targetDatabaseId
  );

  const handleAddOption = () => {
    if (!newOptionName.trim()) return;
    const randomColor = BADGE_COLORS[options.length % BADGE_COLORS.length];
    setOptions([
      ...options,
      {
        id: `opt-${Date.now()}`,
        name: newOptionName.trim(),
        color: randomColor,
      },
    ]);
    setNewOptionName('');
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((o) => o.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const propId = property ? property.id : `prop-${Date.now()}`;
    const newProp: PropertySchema = {
      id: propId,
      name: name.trim(),
      type,
    };

    if (type === 'number') {
      newProp.numberFormat = numberFormat;
    } else if (type === 'select' || type === 'status') {
      newProp.options = options;
    } else if (type === 'relation') {
      newProp.relationConfig = { targetDatabaseId };
    } else if (type === 'rollup') {
      newProp.rollupConfig = {
        relationPropertyId: rollupRelationId,
        targetPropertyId: rollupTargetPropId,
        function: rollupFunction,
      };
    } else if (type === 'formula') {
      newProp.formulaConfig = { expression: formulaExpr };
    }

    if (property) {
      await updatePropertyInDatabase(database.id, newProp);
    } else {
      await addPropertyToDatabase(database.id, newProp);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (property && window.confirm(`Excluir a coluna "${property.name}"?`)) {
      await deletePropertyFromDatabase(database.id, property.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={property ? 'Configurar Propriedade' : 'Adicionar Nova Propriedade'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Nome da Coluna
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Preço, Status, Data Limite"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Tipo de Propriedade
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType)}
            disabled={!!property}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label} - {t.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Number Options */}
        {type === 'number' && (
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Formatação Numérica
            </label>
            <select
              value={numberFormat}
              onChange={(e) => setNumberFormat(e.target.value as NumberFormat)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="number">Número Padrão (ex: 1.234,56)</option>
              <option value="currency_usd">Moeda USD ($)</option>
              <option value="currency_brl">Moeda BRL (R$)</option>
              <option value="percent">Porcentagem (%)</option>
            </select>
          </div>
        )}

        {/* Select & Status Options */}
        {(type === 'select' || type === 'status') && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-gray-500">
              Opções do Rótulo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                placeholder="Nova opção..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium rounded-lg"
              >
                + Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {options.map((opt) => (
                <Badge
                  key={opt.id}
                  label={opt.name}
                  color={opt.color}
                  onRemove={() => handleRemoveOption(opt.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Relation Options */}
        {type === 'relation' && (
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Base de Dados Alvo
            </label>
            <select
              value={targetDatabaseId}
              onChange={(e) => setTargetDatabaseId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione uma base de dados...</option>
              {allDatabases
                .filter((d) => d.id !== database.id)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Rollup Options */}
        {type === 'rollup' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                1. Propriedade de Relação
              </label>
              <select
                value={rollupRelationId}
                onChange={(e) => setRollupRelationId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecione a Relação...</option>
                {relationProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {targetDbForRollup && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  2. Propriedade Alvo (na tabela vinculada)
                </label>
                <select
                  value={rollupTargetPropId}
                  onChange={(e) => setRollupTargetPropId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Selecione a propriedade alvo...</option>
                  {targetDbForRollup.properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                3. Função de Agregação
              </label>
              <select
                value={rollupFunction}
                onChange={(e) => setRollupFunction(e.target.value as RollupFunction)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="count">Contagem Total (Count)</option>
                <option value="count_unique">Contagem de Únicos (Count Unique)</option>
                <option value="sum">Soma (Sum)</option>
                <option value="average">Média (Average)</option>
                <option value="min">Mínimo (Min)</option>
                <option value="max">Máximo (Max)</option>
                <option value="show_original">Mostrar Originais (List)</option>
              </select>
            </div>
          </div>
        )}

        {/* Formula Options */}
        {type === 'formula' && (
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Expressão da Fórmula
            </label>
            <textarea
              value={formulaExpr}
              onChange={(e) => setFormulaExpr(e.target.value)}
              placeholder='Ex: prop("Preço") * prop("Quantidade") ou if(prop("Status") == "Concluído", "Feito", "Pendente")'
              rows={3}
              className="w-full p-2.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Dica: Use <code className="bg-gray-100 px-1 py-0.5 rounded">prop("NomeDaColuna")</code>{' '}
              para acessar colunas. Suporta operadores (+, -, *, /), concatenação de texto,{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">if(...)</code>,{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">round(...)</code>,{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">upper(...)</code>.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {property ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-medium text-red-600 hover:text-red-800"
            >
              Excluir Coluna
            </button>
          ) : <span />}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
