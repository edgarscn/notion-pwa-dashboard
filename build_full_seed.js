const fs = require('fs');

const rows = JSON.parse(fs.readFileSync('./src/db/parsed_rows.json', 'utf-8'));

const formattedRows = rows.map((r, idx) => {
  const parseNum = (val) => {
    if (!val || val === 'N/A') return null;
    const num = Number(val.replace(',', '.'));
    return isNaN(num) ? null : num;
  };

  return {
    materia: r['Matéria'] || '',
    aula: r['Aula'] || '',
    conteudo: r['Conteúdo'] || r['Assunto'] || '',
    feitas: parseNum(r['Feitas']),
    acertos: parseNum(r['Acertos']),
    erros: parseNum(r['Erros']),
    emBranco: parseNum(r['Em branco']),
    total: parseNum(r['Total de questões']),
    tempo: parseNum(r['Tempo de estudo (líquido)']),
    created: r['Created time'] || new Date().toISOString(),
    obs: r['Observações'] || r['Histórico de Revisões'] || '',
  };
});

const tsContent = `import { db } from './index';
import { Teamspace, Page, Database, RecordItem } from '../types';

export async function seedInitialData() {
  const now = new Date().toISOString();

  // Check if Bloco de Estudos database already exists in IndexedDB
  const existingBlocoDb = await db.databases.get('db-bloco-estudos');
  const existingRecordsCount = existingBlocoDb
    ? await db.records.where('databaseId').equals('db-bloco-estudos').count()
    : 0;

  // Force seed if less than 100 rows
  if (existingBlocoDb && existingRecordsCount >= 100) return;

  // 1. Teamspaces
  const teamspaceStudies: Teamspace = {
    id: 'ts-estudos',
    name: '📚 Concursos & Estudos',
    icon: '📚',
    description: 'Gestão de horas líquidas, resolução de questões e revisões programadas.',
    createdAt: now,
    updatedAt: now,
  };

  await db.teamspaces.put(teamspaceStudies);

  // 2. Pages
  const pageBlocoEstudos: Page = {
    id: 'page-bloco-estudos',
    teamspaceId: 'ts-estudos',
    parentId: null,
    title: '📚 Bloco de Estudos',
    icon: '📚',
    isDatabase: true,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };
  await db.pages.put(pageBlocoEstudos);

  // 3. Database Schema for "Bloco de Estudos"
  const dbBlocoEstudos: Database = {
    id: 'db-bloco-estudos',
    pageId: 'page-bloco-estudos',
    title: 'Bloco de Estudos',
    description: 'Tabela de controle de questões, taxa de acerto tradicional e Cespe (Certo/Errado), tempo de estudo e revisões.',
    defaultView: 'table',
    createdAt: now,
    updatedAt: now,
    properties: [
      {
        id: 'p-materia',
        name: 'Matéria',
        type: 'select',
        options: [
          { id: 'm-port', name: 'Português', color: 'bg-blue-100 text-blue-700 border-blue-300' },
          { id: 'm-penal', name: 'Direito Penal', color: 'bg-red-100 text-red-700 border-red-300' },
          { id: 'm-info', name: 'Informática', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
          { id: 'm-rlm', name: 'Raciocínio Lógico', color: 'bg-purple-100 text-purple-700 border-purple-300' },
          { id: 'm-const', name: 'Direito Constitucional', color: 'bg-amber-100 text-amber-700 border-amber-300' },
          { id: 'm-dpp', name: 'Direito Processual Penal', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
          { id: 'm-adm', name: 'Direito Administrativo', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
          { id: 'm-civil', name: 'Direito Civil', color: 'bg-rose-100 text-rose-700 border-rose-300' },
          { id: 'm-dh', name: 'Direitos Humanos', color: 'bg-green-100 text-green-700 border-green-300' },
          { id: 'm-leg', name: 'Legislação Penal', color: 'bg-orange-100 text-orange-700 border-orange-300' },
          { id: 'm-rev', name: 'Revisão', color: 'bg-gray-100 text-gray-700 border-gray-300' },
          { id: 'm-anki', name: 'Anki', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
        ],
      },
      {
        id: 'p-aula',
        name: 'Aula',
        type: 'select',
        options: [
          { id: 'a-00', name: '00', color: 'bg-gray-100 text-gray-700 border-gray-300' },
          { id: 'a-01', name: '01', color: 'bg-blue-100 text-blue-700 border-blue-300' },
          { id: 'a-02', name: '02', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
          { id: 'a-03', name: '03', color: 'bg-purple-100 text-purple-700 border-purple-300' },
          { id: 'a-04', name: '04', color: 'bg-amber-100 text-amber-700 border-amber-300' },
          { id: 'a-05', name: '05', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
          { id: 'a-06', name: '06', color: 'bg-rose-100 text-rose-700 border-rose-300' },
          { id: 'a-07', name: '07', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
          { id: 'a-08', name: '08', color: 'bg-green-100 text-green-700 border-green-300' },
          { id: 'a-09', name: '09', color: 'bg-teal-100 text-teal-700 border-teal-300' },
          { id: 'a-10', name: '10', color: 'bg-orange-100 text-orange-700 border-orange-300' },
          { id: 'a-11', name: '11', color: 'bg-violet-100 text-violet-700 border-violet-300' },
          { id: 'a-12', name: '12', color: 'bg-pink-100 text-pink-700 border-pink-300' },
        ],
      },
      { id: 'p-conteudo', name: 'Conteúdo', type: 'text' },
      { id: 'p-feitas', name: 'Feitas', type: 'number', numberFormat: 'number' },
      { id: 'p-acertos', name: 'Acertos', type: 'number', numberFormat: 'number' },
      { id: 'p-erros', name: 'Erros', type: 'number', numberFormat: 'number' },
      { id: 'p-em-branco', name: 'Em branco', type: 'number', numberFormat: 'number' },
      { id: 'p-total-questoes', name: 'Total de questões', type: 'number', numberFormat: 'number' },
      { id: 'p-tempo', name: 'Tempo de estudo (líquido)', type: 'number', numberFormat: 'number' },
      {
        id: 'p-taxa',
        name: 'Taxa de acerto',
        type: 'formula',
        formulaConfig: { expression: 'if(prop("Feitas") > 0, round(prop("Acertos") / prop("Feitas") * 100, 1) + "%", "N/A")' },
      },
      {
        id: 'p-taxa-cespe',
        name: 'Taxa de acerto Cespe',
        type: 'formula',
        formulaConfig: { expression: 'if(prop("Feitas") > 0, round((prop("Acertos") - prop("Erros")) / prop("Feitas") * 100, 1) + "%", "N/A")' },
      },
      { id: 'p-created', name: 'Created time', type: 'created_time' },
      { id: 'p-obs', name: 'Observações', type: 'text' },
    ],
  };
  await db.databases.put(dbBlocoEstudos);

  // 4. Sample Real Study Records (${formattedRows.length} rows)
  const sampleStudyRows = ${JSON.stringify(formattedRows, null, 2)};

  const studyRecords: RecordItem[] = sampleStudyRows.map((row, idx) => ({
    id: \`rec-study-\${idx + 1}\`,
    databaseId: 'db-bloco-estudos',
    order: idx,
    createdAt: row.created || now,
    updatedAt: row.created || now,
    values: {
      'p-materia': row.materia,
      'p-aula': row.aula,
      'p-conteudo': row.conteudo,
      'p-feitas': row.feitas,
      'p-acertos': row.acertos,
      'p-erros': row.erros,
      'p-em-branco': row.emBranco,
      'p-total-questoes': row.total || row.feitas,
      'p-tempo': row.tempo,
      'p-created': row.created,
      'p-obs': row.obs || '',
    },
  }));

  await db.records.bulkPut(studyRecords);
}

export async function resetAndReseedDatabase() {
  await db.records.clear();
  await db.databases.clear();
  await db.pages.clear();
  await db.teamspaces.clear();
  await seedInitialData();
}
`;

fs.writeFileSync('./src/db/seed.ts', tsContent);
console.log('Seed file successfully updated with all 407 records!');
