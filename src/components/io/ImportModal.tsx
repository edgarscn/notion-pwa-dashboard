import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Database, PropertySchema, PropertyType } from '../../types';
import { parseCSVFile, parseXLSXFile, ParsedImportData } from '../../utils/importExport';
import { createPage, createRecord, addPropertyToDatabase } from '../../db/repository';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamspaceId: string;
  currentDatabase?: Database | null;
  onImportCompleted: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  teamspaceId,
  currentDatabase,
  onImportCompleted,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedImportData | null>(null);
  const [importMode, setImportMode] = useState<'new_db' | 'existing_db'>(
    currentDatabase ? 'existing_db' : 'new_db'
  );
  const [newDbTitle, setNewDbTitle] = useState('');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMsg('');
    try {
      let data: ParsedImportData;
      if (selectedFile.name.endsWith('.csv')) {
        data = await parseCSVFile(selectedFile);
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        data = await parseXLSXFile(selectedFile);
      } else {
        setErrorMsg('Formato inválido. Por favor envie um arquivo .csv ou .xlsx.');
        return;
      }

      setParsedData(data);
      setNewDbTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));

      // Initial column mapping if importing to existing database
      if (currentDatabase) {
        const mapping: Record<string, string> = {};
        data.headers.forEach((h) => {
          const match = currentDatabase.properties.find(
            (p) => p.name.toLowerCase() === h.toLowerCase()
          );
          if (match) mapping[h] = match.id;
        });
        setColumnMapping(mapping);
      }
    } catch (err: any) {
      setErrorMsg(`Erro ao ler arquivo: ${err.message || 'Formato incorreto'}`);
    }
  };

  const handleExecuteImport = async () => {
    if (!parsedData || parsedData.rows.length === 0) return;
    setIsProcessing(true);

    try {
      let targetDbId = currentDatabase?.id;

      if (importMode === 'new_db' || !targetDbId) {
        // 1. Create a new Page & Database
        const pageTitle = newDbTitle.trim() || 'Base Importada';
        const page = await createPage(teamspaceId, null, pageTitle, true, '📊');

        // Fetch created database
        const { db } = await import('../../db');
        const dbCreated = await db.databases.where('pageId').equals(page.id).first();
        if (!dbCreated) throw new Error('Falha ao criar base de dados.');

        targetDbId = dbCreated.id;

        // Auto-detect properties from headers
        for (let i = 0; i < parsedData.headers.length; i++) {
          const header = parsedData.headers[i];
          const sampleVal = parsedData.rows.find((r) => r[header] !== undefined)?.[header];

          let propType: PropertyType = 'text';
          if (typeof sampleVal === 'number' || (!isNaN(Number(sampleVal)) && sampleVal !== '')) {
            propType = 'number';
          } else if (typeof sampleVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(sampleVal)) {
            propType = 'date';
          }

          if (i > 0) {
            await addPropertyToDatabase(targetDbId, {
              id: `prop-imp-${i}-${Date.now()}`,
              name: header,
              type: propType,
            });
          }
        }
      }

      // Fetch target database properties
      const { db } = await import('../../db');
      const targetDb = await db.databases.get(targetDbId);
      if (!targetDb) throw new Error('Base de dados não encontrada.');

      // Insert rows
      for (const row of parsedData.rows) {
        const rowValues: Record<string, any> = {};

        if (importMode === 'new_db') {
          targetDb.properties.forEach((prop) => {
            const fileHeader = parsedData.headers.find(
              (h) => h.toLowerCase() === prop.name.toLowerCase()
            );
            if (fileHeader) {
              rowValues[prop.id] = row[fileHeader];
            }
          });
        } else {
          // Map via columnMapping
          Object.entries(columnMapping).forEach(([fileHeader, targetPropId]) => {
            if (targetPropId) {
              rowValues[targetPropId] = row[fileHeader];
            }
          });
        }

        await createRecord(targetDbId, rowValues);
      }

      setIsProcessing(false);
      onImportCompleted();
      onClose();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(`Erro durante importação: ${err.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importar Base de Dados (CSV / Excel)"
    >
      <div className="space-y-4">
        {/* Upload Drop Zone */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-gray-50/50">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            id="file-upload"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <FileSpreadsheet className="w-10 h-10 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              {file ? file.name : 'Clique para selecionar arquivo .csv ou .xlsx'}
            </span>
            <span className="text-xs text-gray-400">
              Suporta planilhas CSV e tabelas Excel Microsoft
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {parsedData && (
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                {parsedData.headers.length} colunas e {parsedData.rows.length} registros prontos para importação!
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Modo de Importação
              </label>
              <div className="flex gap-4 text-xs font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={importMode === 'new_db'}
                    onChange={() => setImportMode('new_db')}
                    className="text-blue-600"
                  />
                  <span>Criar Nova Base de Dados</span>
                </label>
                {currentDatabase && (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={importMode === 'existing_db'}
                      onChange={() => setImportMode('existing_db')}
                      className="text-blue-600"
                    />
                    <span>Mapear para a Base Atual ("{currentDatabase.title}")</span>
                  </label>
                )}
              </div>
            </div>

            {importMode === 'new_db' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Nome da Nova Base de Dados
                </label>
                <input
                  type="text"
                  value={newDbTitle}
                  onChange={(e) => setNewDbTitle(e.target.value)}
                  placeholder="Nome da base..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {importMode === 'existing_db' && currentDatabase && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Mapeamento de Colunas (Arquivo → Base)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {parsedData.headers.map((header) => (
                    <div key={header} className="flex items-center justify-between text-xs gap-2">
                      <span className="font-mono text-gray-700 truncate w-1/2">{header}</span>
                      <select
                        value={columnMapping[header] || ''}
                        onChange={(e) =>
                          setColumnMapping({ ...columnMapping, [header]: e.target.value })
                        }
                        className="w-1/2 px-2 py-1 border border-gray-300 rounded bg-white"
                      >
                        <option value="">(Ignorar)</option>
                        {currentDatabase.properties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleExecuteImport}
            disabled={!parsedData || isProcessing}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? 'Importando...' : 'Confirmar Importação'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
