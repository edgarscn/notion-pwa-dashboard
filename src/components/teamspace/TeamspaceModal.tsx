import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Teamspace } from '../../types';

interface TeamspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, description?: string) => Promise<void>;
  teamspace?: Teamspace | null;
}

const EMOJI_OPTIONS = ['🚀', '🏢', '🏡', '📚', '💼', '🎯', '💡', '⚡', '📊', '🎨'];

export const TeamspaceModal: React.FC<TeamspaceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamspace,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏢');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (teamspace) {
      setName(teamspace.name);
      setIcon(teamspace.icon || '🏢');
      setDescription(teamspace.description || '');
    } else {
      setName('');
      setIcon('🏢');
      setDescription('');
    }
  }, [teamspace, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSave(name.trim(), icon, description.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teamspace ? 'Editar Teamspace' : 'Criar Novo Teamspace'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Ícone</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`w-10 h-10 text-xl rounded-lg border transition-all ${
                  icon === emoji
                    ? 'border-blue-500 bg-blue-50 scale-105 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Nome do Espaço de Trabalho
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Engenharia & Produto"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição sobre a finalidade deste Teamspace..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {teamspace ? 'Salvar Alterações' : 'Criar Teamspace'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
