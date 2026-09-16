import { db } from './index';
import { Teamspace, Page, Database, RecordItem } from '../types';

export async function seedInitialData() {
  const existingTeamspaces = await db.teamspaces.count();
  if (existingTeamspaces > 0) return;

  const now = new Date().toISOString();

  // 1. Teamspaces
  const teamspaceEng: Teamspace = {
    id: 'ts-eng',
    name: '🚀 Engenharia & Produto',
    icon: '🚀',
    description: 'Espaço para gestão de projetos de software, infraestrutura e produto.',
    createdAt: now,
    updatedAt: now,
  };

  const teamspacePersonal: Teamspace = {
    id: 'ts-personal',
    name: '🏡 Pessoal & Estudos',
    icon: '🏡',
    description: 'Anotações pessoais, leitura e planejamento de carreira.',
    createdAt: now,
    updatedAt: now,
  };

  // 2. Pages
  const pageProjects: Page = {
    id: 'page-projects',
    teamspaceId: 'ts-eng',
    parentId: null,
    title: '📋 Quadro de Projetos & Tasks',
    icon: '📋',
    isDatabase: true,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };

  const pageClients: Page = {
    id: 'page-clients',
    teamspaceId: 'ts-eng',
    parentId: null,
    title: '🏢 Clientes & Parceiros',
    icon: '🏢',
    isDatabase: true,
    order: 1,
    createdAt: now,
    updatedAt: now,
  };

  const pageDoc: Page = {
    id: 'page-doc',
    teamspaceId: 'ts-eng',
    parentId: 'page-projects', // Nested page!
    title: '📚 Roteiro Técnico & Guias',
    icon: '📚',
    isDatabase: false,
    content: `# Guias de Desenvolvimento Notion PWA

Bem-vindo ao workspace! Esta é uma página de documento padrão aninhada sob a base de dados de projetos.

### Funcionalidades do Sistema:
- **Teamspaces**: Crie e alterne entre múltiplos ambientes de trabalho na barra lateral.
- **Árvore de Páginas**: Aninhe documentos e bases de dados com suporte a drag-and-drop.
- **Bases de Dados Inteligentes**:
  - **Tabela**: Edição rápida inline com 9 tipos de propriedades.
  - **Quadro (Kanban)**: Agrupamento automático por Status ou Select.
  - **Fórmulas**: Expressões matemáticas como \`prop("Horas") * 50\`.
  - **Relações & Rollups**: Vínculo bidirecional entre tabelas com agregação de soma, contagem e média.
- **Suporte Offline / PWA**: Dados persistidos localmente no seu navegador usando IndexedDB (Dexie.js).
`,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };

  const pageBooks: Page = {
    id: 'page-books',
    teamspaceId: 'ts-personal',
    parentId: null,
    title: '📖 Biblioteca de Leituras',
    icon: '📖',
    isDatabase: true,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 3. Databases
  const dbProjects: Database = {
    id: 'db-projects',
    pageId: 'page-projects',
    title: 'Quadro de Projetos & Tasks',
    description: 'Gestão de sprints, tarefas e estimativas com fórmulas e relações.',
    defaultView: 'table',
    createdAt: now,
    updatedAt: now,
    properties: [
      { id: 'p-title', name: 'Nome da Tarefa', type: 'text' },
      {
        id: 'p-status',
        name: 'Status',
        type: 'status',
        options: [
          { id: 'st-1', name: 'Não iniciado', color: 'bg-gray-100 text-gray-700 border-gray-300' },
          { id: 'st-2', name: 'Em andamento', color: 'bg-blue-100 text-blue-700 border-blue-300' },
          { id: 'st-3', name: 'Concluído', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
        ],
      },
      {
        id: 'p-priority',
        name: 'Prioridade',
        type: 'select',
        options: [
          { id: 'opt-high', name: 'Alta', color: 'bg-red-100 text-red-700 border-red-300' },
          { id: 'opt-med', name: 'Média', color: 'bg-amber-100 text-amber-700 border-amber-300' },
          { id: 'opt-low', name: 'Baixa', color: 'bg-green-100 text-green-700 border-green-300' },
        ],
      },
      { id: 'p-hours', name: 'Horas Estimadas', type: 'number', numberFormat: 'number' },
      { id: 'p-cost', name: 'Custo ($)', type: 'number', numberFormat: 'currency_usd' },
      {
        id: 'p-formula',
        name: 'Valor Orçado ($)',
        type: 'formula',
        formulaConfig: { expression: 'prop("Custo ($)") * 1.2' },
      },
      { id: 'p-date', name: 'Data Limite', type: 'date' },
      {
        id: 'p-relation-client',
        name: 'Cliente Vinculado',
        type: 'relation',
        relationConfig: { targetDatabaseId: 'db-clients' },
      },
      { id: 'p-created', name: 'Data Criação', type: 'created_time' },
    ],
  };

  const dbClients: Database = {
    id: 'db-clients',
    pageId: 'page-clients',
    title: 'Clientes & Parceiros',
    description: 'Cadastro de clientes com rollups de custo e quantidade de projetos.',
    defaultView: 'table',
    createdAt: now,
    updatedAt: now,
    properties: [
      { id: 'pc-name', name: 'Empresa', type: 'text' },
      {
        id: 'pc-segment',
        name: 'Segmento',
        type: 'select',
        options: [
          { id: 'seg-tech', name: 'Tecnologia', color: 'bg-purple-100 text-purple-700 border-purple-300' },
          { id: 'seg-fin', name: 'Finanças', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
        ],
      },
      {
        id: 'pc-projects',
        name: 'Projetos Relacionados',
        type: 'relation',
        relationConfig: { targetDatabaseId: 'db-projects' },
      },
      {
        id: 'pc-total-cost',
        name: 'Total Investido ($)',
        type: 'rollup',
        rollupConfig: {
          relationPropertyId: 'pc-projects',
          targetPropertyId: 'p-cost',
          function: 'sum',
        },
      },
      {
        id: 'pc-project-count',
        name: 'Qtd Projetos',
        type: 'rollup',
        rollupConfig: {
          relationPropertyId: 'pc-projects',
          targetPropertyId: 'p-title',
          function: 'count',
        },
      },
      { id: 'pc-created', name: 'Data Cadastro', type: 'created_time' },
    ],
  };

  const dbBooks: Database = {
    id: 'db-books',
    pageId: 'page-books',
    title: 'Biblioteca de Leituras',
    description: 'Acompanhamento de livros e referências.',
    defaultView: 'board',
    createdAt: now,
    updatedAt: now,
    properties: [
      { id: 'pb-title', name: 'Título do Livro', type: 'text' },
      { id: 'pb-author', name: 'Autor', type: 'text' },
      {
        id: 'pb-status',
        name: 'Status',
        type: 'status',
        options: [
          { id: 'bs-1', name: 'Não iniciado', color: 'bg-gray-100 text-gray-700 border-gray-300' },
          { id: 'bs-2', name: 'Em andamento', color: 'bg-blue-100 text-blue-700 border-blue-300' },
          { id: 'bs-3', name: 'Concluído', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
        ],
      },
      { id: 'pb-rating', name: 'Nota (1-5)', type: 'number', numberFormat: 'number' },
      { id: 'pb-created', name: 'Adicionado Em', type: 'created_time' },
    ],
  };

  // 4. Sample Records
  const rec1: RecordItem = {
    id: 'rec-1',
    databaseId: 'db-projects',
    order: 0,
    createdAt: now,
    updatedAt: now,
    values: {
      'p-title': 'Refatoração da Arquitetura PWA',
      'p-status': 'Em andamento',
      'p-priority': 'Alta',
      'p-hours': 40,
      'p-cost': 2500,
      'p-date': '2026-10-01',
      'p-relation-client': ['rec-client-1'],
      'p-created': now,
    },
  };

  const rec2: RecordItem = {
    id: 'rec-2',
    databaseId: 'db-projects',
    order: 1,
    createdAt: now,
    updatedAt: now,
    values: {
      'p-title': 'Painel Kanban e Motor de Rollups',
      'p-status': 'Em andamento',
      'p-priority': 'Média',
      'p-hours': 24,
      'p-cost': 1800,
      'p-date': '2026-10-15',
      'p-relation-client': ['rec-client-1'],
      'p-created': now,
    },
  };

  const rec3: RecordItem = {
    id: 'rec-3',
    databaseId: 'db-projects',
    order: 2,
    createdAt: now,
    updatedAt: now,
    values: {
      'p-title': 'Deploy Estático Netlify e CI/CD',
      'p-status': 'Concluído',
      'p-priority': 'Baixa',
      'p-hours': 10,
      'p-cost': 800,
      'p-date': '2026-09-20',
      'p-relation-client': ['rec-client-2'],
      'p-created': now,
    },
  };

  const recClient1: RecordItem = {
    id: 'rec-client-1',
    databaseId: 'db-clients',
    order: 0,
    createdAt: now,
    updatedAt: now,
    values: {
      'pc-name': 'Acme Global Innovations',
      'pc-segment': 'Tecnologia',
      'pc-projects': ['rec-1', 'rec-2'],
      'pc-created': now,
    },
  };

  const recClient2: RecordItem = {
    id: 'rec-client-2',
    databaseId: 'db-clients',
    order: 1,
    createdAt: now,
    updatedAt: now,
    values: {
      'pc-name': 'Fintech Horizon S.A.',
      'pc-segment': 'Finanças',
      'pc-projects': ['rec-3'],
      'pc-created': now,
    },
  };

  const recBook1: RecordItem = {
    id: 'rec-book-1',
    databaseId: 'db-books',
    order: 0,
    createdAt: now,
    updatedAt: now,
    values: {
      'pb-title': 'Designing Data-Intensive Applications',
      'pb-author': 'Martin Kleppmann',
      'pb-status': 'Em andamento',
      'pb-rating': 5,
      'pb-created': now,
    },
  };

  const recBook2: RecordItem = {
    id: 'rec-book-2',
    databaseId: 'db-books',
    order: 1,
    createdAt: now,
    updatedAt: now,
    values: {
      'pb-title': 'Clean Code',
      'pb-author': 'Robert C. Martin',
      'pb-status': 'Concluído',
      'pb-rating': 5,
      'pb-created': now,
    },
  };

  // Bulk add into Dexie DB
  await db.teamspaces.bulkAdd([teamspaceEng, teamspacePersonal]);
  await db.pages.bulkAdd([pageProjects, pageClients, pageDoc, pageBooks]);
  await db.databases.bulkAdd([dbProjects, dbClients, dbBooks]);
  await db.records.bulkAdd([rec1, rec2, rec3, recClient1, recClient2, recBook1, recBook2]);
}
