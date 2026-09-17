import { db } from './index';
import { Teamspace, Page, Database, RecordItem } from '../types';

export async function seedInitialData() {
  const now = new Date().toISOString();

  // Check if Bloco de Estudos database already exists in IndexedDB
  const existingBlocoDb = await db.databases.get('db-bloco-estudos');
  if (existingBlocoDb) return; // Already seeded!

  // 1. Teamspaces
  const teamspaceStudies: Teamspace = {
    id: 'ts-estudos',
    name: '📚 Concursos & Estudos',
    icon: '📚',
    description: 'Gestão de horas líquidas, resolução de questões e revisões programadas.',
    createdAt: now,
    updatedAt: now,
  };

  const existingTsStudies = await db.teamspaces.get('ts-estudos');
  if (!existingTsStudies) {
    await db.teamspaces.put(teamspaceStudies);
  }

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

  // 4. Sample Real Study Records from Notion CSV Export
  const sampleStudyRows = [
    { materia: 'Português', aula: '00', conteudo: 'Ortografia e Acentuação Gráfica', feitas: 7, acertos: 5, erros: 2, emBranco: -7, tempo: 2, created: '2026-03-01T17:36:00.000Z' },
    { materia: 'Direito Penal', aula: '00', conteudo: 'Princípios do Direito Penal', feitas: 10, acertos: 5, erros: 5, emBranco: -10, tempo: 2, created: '2026-03-01T17:45:00.000Z' },
    { materia: 'Informática', aula: '00', conteudo: 'Redes de computadores 1', feitas: 10, acertos: 7, erros: 3, emBranco: -10, tempo: 2, created: '2026-03-01T17:45:00.000Z' },
    { materia: 'Direito Constitucional', aula: '00', conteudo: 'Teoria da Constituição', feitas: 10, acertos: 7, erros: 3, emBranco: -10, tempo: 2, created: '2026-03-04T18:08:00.000Z' },
    { materia: 'Raciocínio Lógico', aula: '00', conteudo: 'Proposições simples', feitas: 10, acertos: 8, erros: 2, emBranco: -10, tempo: 2, created: '2026-03-05T09:18:00.000Z' },
    { materia: 'Direito Processual Penal', aula: '00', conteudo: 'Juiz de garantia, Princípios do direito processual penal', feitas: 13, acertos: 10, erros: 3, emBranco: -13, tempo: 2, created: '2026-03-05T14:23:00.000Z' },
    { materia: 'Direito Administrativo', aula: '00', conteudo: 'Organização administrativa', feitas: 10, acertos: 10, erros: 0, emBranco: -10, tempo: 2, created: '2026-03-05T14:33:00.000Z' },
    { materia: 'Legislação Penal', aula: '00', conteudo: 'Estatuto do desarmamento', feitas: 10, acertos: 8, erros: 2, emBranco: -10, tempo: 2, created: '2026-03-06T06:57:00.000Z' },
    { materia: 'Português', aula: '00', conteudo: 'Ortografia e Acentuação Gráfica', feitas: 10, acertos: 6, erros: 4, emBranco: -10, tempo: 2, created: '2026-03-06T17:32:00.000Z' },
    { materia: 'Direito Penal', aula: '00', conteudo: 'Princípios do Direito Penal', feitas: 13, acertos: 9, erros: 4, emBranco: -13, tempo: 2, created: '2026-03-06T19:55:00.000Z' },
    { materia: 'Direito Civil', aula: '00', conteudo: 'Noções Gerais de Direito Civil', feitas: 10, acertos: 7, erros: 3, emBranco: -10, tempo: 2, created: '2026-03-09T08:58:00.000Z' },
    { materia: 'Português', aula: '00', conteudo: 'Emprego do Hífen', feitas: 9, acertos: 6, erros: 3, emBranco: -9, tempo: 1, created: '2026-03-09T11:10:00.000Z' },
    { materia: 'Direito Constitucional', aula: '00', conteudo: 'Constituições', feitas: 10, acertos: 7, erros: 3, emBranco: -10, tempo: 2, created: '2026-03-09T17:16:00.000Z' },
    { materia: 'Direito Administrativo', aula: '00', conteudo: 'Administração Pública, Organização administrativa', feitas: 18, acertos: 14, erros: 4, emBranco: -18, tempo: 0.5, created: '2026-03-10T10:30:00.000Z' },
    { materia: 'Legislação Penal', aula: '00', conteudo: 'Estatuto do desarmamento', feitas: 9, acertos: 7, erros: 2, emBranco: -9, tempo: 1, created: '2026-03-10T11:40:00.000Z' },
    { materia: 'Raciocínio Lógico', aula: '00', conteudo: 'Proposições compostas', feitas: 10, acertos: 7, erros: 3, emBranco: -10, tempo: 2, created: '2026-03-10T15:37:00.000Z' },
    { materia: 'Direitos Humanos', aula: '00', conteudo: 'Teoria Geral dos Direitos Humanos', feitas: 0, acertos: 0, erros: 0, emBranco: 0, tempo: 2, created: '2026-03-11T10:46:00.000Z' },
    { materia: 'Português', aula: '00', conteudo: 'Ortografia e Acentuação Gráfica', feitas: 10, acertos: 6, erros: 4, emBranco: -10, tempo: 1, obs: 'Expressões problemáticas', created: '2026-03-13T14:51:00.000Z' },
    { materia: 'Português', aula: '01', conteudo: 'Substantivos; Adjetivos; Artigos; Numerais; Advérbios e Interjeições', feitas: 5, acertos: 5, erros: 0, emBranco: -5, tempo: 1, obs: 'Substantivos', created: '2026-03-13T14:55:00.000Z' },
    { materia: 'Direito Penal', aula: '01', conteudo: 'Aplicação da Lei Penal', feitas: 10, acertos: 7, erros: 3, emBranco: -10, tempo: 2, obs: 'Lei Penal no tempo e espaço', created: '2026-03-16T11:34:00.000Z' },
    { materia: 'Direito Constitucional', aula: '01', conteudo: 'Direitos Fundamentais', feitas: 15, acertos: 10, erros: 5, emBranco: -15, tempo: 1, created: '2026-03-17T09:16:00.000Z' },
    { materia: 'Revisão', aula: '00', conteudo: 'Revisão Geral PDFs 00-02', feitas: 55, acertos: 40, erros: 15, emBranco: 0, tempo: 0.5, total: 55, created: '2026-03-27T16:55:00.000Z' },
    { materia: 'Informática', aula: '07', conteudo: 'Segurança da Informação I', feitas: 10, acertos: 9, erros: 1, emBranco: -10, tempo: 2, created: '2026-03-25T11:12:00.000Z' },
    { materia: 'Legislação Penal', aula: '03', conteudo: 'Lei de Abuso de Autoridade', feitas: 13, acertos: 12, erros: 1, emBranco: -13, tempo: 1.5, created: '2026-04-14T10:31:00.000Z' },
  ];

  const studyRecords: RecordItem[] = sampleStudyRows.map((row, idx) => ({
    id: `rec-study-${idx + 1}`,
    databaseId: 'db-bloco-estudos',
    order: idx,
    createdAt: row.created,
    updatedAt: row.created,
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
