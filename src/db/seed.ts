import { db } from './index';
import { Teamspace, Page, Database, RecordItem } from '../types';

export async function seedInitialData() {
  const now = new Date().toISOString();
  const SEED_VERSION = 'notion_pwa_seed_v3';

  // Check if Bloco de Estudos database already exists in IndexedDB
  const existingBlocoDb = await db.databases.get('db-bloco-estudos');
  const existingRecordsCount = existingBlocoDb
    ? await db.records.where('databaseId').equals('db-bloco-estudos').count()
    : 0;
  
  const savedVersion = typeof window !== 'undefined' ? localStorage.getItem('seed_version') : null;

  // Force seed if version is old or row count is incomplete
  if (existingBlocoDb && existingRecordsCount >= 408 && savedVersion === SEED_VERSION) {
    return;
  }

  // Clear old shifted records if present
  if (existingBlocoDb) {
    await db.records.where('databaseId').equals('db-bloco-estudos').delete();
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('seed_version', SEED_VERSION);
  }

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
          {
                    "id": "mat-1",
                    "name": "Português",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "mat-2",
                    "name": "Direito Penal",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "mat-3",
                    "name": "Informática",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "mat-4",
                    "name": "Direito Constitucional",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "mat-5",
                    "name": "Raciocínio Lógico",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "mat-6",
                    "name": "Direito Processual Penal",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "mat-7",
                    "name": "Direito Administrativo",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "mat-8",
                    "name": "Legislação Penal",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "mat-9",
                    "name": "Direito Civil",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "mat-10",
                    "name": "Direitos Humanos",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "mat-11",
                    "name": "Revisão",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "mat-12",
                    "name": "Português, Revisão",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "mat-13",
                    "name": "Direitos Humanos, Revisão",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "mat-14",
                    "name": "Direito Penal, Revisão",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "mat-15",
                    "name": "Direito Civil, Revisão",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "mat-16",
                    "name": "Direito Constitucional, Revisão",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "mat-17",
                    "name": "Direito Administrativo, Revisão",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "mat-18",
                    "name": "Direito Processual Penal, Revisão",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "mat-19",
                    "name": "Informática, Revisão",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "mat-20",
                    "name": "Legislação Penal, Revisão",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "mat-21",
                    "name": "Raciocínio Lógico, Revisão",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "mat-22",
                    "name": "Legislação",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "mat-23",
                    "name": "Anki",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          }
]
      },
      {
        id: 'p-aula',
        name: 'Aula',
        type: 'select',
        options: [
          {
                    "id": "aula-1",
                    "name": "00",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-2",
                    "name": "01",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-3",
                    "name": "02",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-4",
                    "name": "03",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-5",
                    "name": "04",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-6",
                    "name": "05",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-7",
                    "name": "06",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-8",
                    "name": "07",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-9",
                    "name": "08",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-10",
                    "name": "09",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-11",
                    "name": "10",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-12",
                    "name": "11",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          },
          {
                    "id": "aula-13",
                    "name": "12",
                    "color": "bg-gray-100 text-gray-700 border-gray-300"
          }
]
      },
      {
        id: 'p-conteudo',
        name: 'Conteúdo',
        type: 'select',
        options: [
          {
                    "id": "cont-1",
                    "name": "Ortografia e Acentuação Gráfica",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-2",
                    "name": "Princípios do Direito Penal",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-3",
                    "name": "Redes de computadores 1",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-4",
                    "name": "Proposições simples",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-5",
                    "name": "Juiz de garantia",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-6",
                    "name": "Princípios do direito processual penal",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-7",
                    "name": "Organização administrativa",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-8",
                    "name": "Estatuto do desarmamento",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-9",
                    "name": "Noções Gerais de Direito Civil",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-10",
                    "name": "Emprego do Hífen",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-11",
                    "name": "Constituições",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-12",
                    "name": "Administração Pública",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-13",
                    "name": "Proposições compostas",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-14",
                    "name": "Teoria Geral dos Direitos Humanos",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-15",
                    "name": "Substantivos",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-16",
                    "name": "Adjetivos",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-17",
                    "name": "Artigos",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-18",
                    "name": "Numerais",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-19",
                    "name": "Advérbios e Interjeições",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-20",
                    "name": "Aplicação da Lei Penal",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-21",
                    "name": "Direito Fundamentais",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-22",
                    "name": "Equivalências Lógicas",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-23",
                    "name": "Inquerito Policial",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-24",
                    "name": "Estatais e fundações",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-25",
                    "name": "Lei de tortura",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-26",
                    "name": "Redes de computadores 2",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-27",
                    "name": "Das Pessoas físicas e domicílio",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-28",
                    "name": "Teoria do Delito I",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-29",
                    "name": "Segurança da Informação I",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-30",
                    "name": "Direitos e Deveres individuais e coletivos",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-31",
                    "name": "Deveres e Poderes administrativos",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-32",
                    "name": "Conjunções e Preposições",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-33",
                    "name": "Pessoas Jurídicas",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-34",
                    "name": "Afirmação Histórica dos Direitos Humanos",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-35",
                    "name": "Lei de Drogas",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-36",
                    "name": "Algebra das expressões",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-37",
                    "name": "Culpabilidade",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-38",
                    "name": "Direitos e Deveres Individuais e Coletivos II",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-39",
                    "name": "Remédios constitucionais",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-40",
                    "name": "Jurisdição e Competência",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-41",
                    "name": "Atos Administrativos",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-42",
                    "name": "Computação em nuvem",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-43",
                    "name": "Dos Bens",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-44",
                    "name": "Lei de Abuso de Autoridade",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-45",
                    "name": "PNHD",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-46",
                    "name": "Diagramas Lógicos",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-47",
                    "name": "Pronomes",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-48",
                    "name": "Direitos Humanos e Responsabilização do Estado",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-49",
                    "name": "Intranet e extranet",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-50",
                    "name": "Concurso de Pessoas",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-51",
                    "name": "Verbos tempos e modos verbais.",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-52",
                    "name": "Direitos Sociais",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-53",
                    "name": "Sujeitos do Processo",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-54",
                    "name": "Ferramentas de Busca",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-55",
                    "name": "Dos Fatos Jurídicos e Negócios Jurídicos",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-56",
                    "name": "Direitos Humanos na Consituição Federal",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-57",
                    "name": "Estatudo da Criança e do Adolescente",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-58",
                    "name": "Licitações I",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-59",
                    "name": "Lógica de Argumentação",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-60",
                    "name": "Nacionalidade",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-61",
                    "name": "Extinção de punibilidade",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-62",
                    "name": "Ato Ilícito",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-63",
                    "name": "Correlação e vozes verbais",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-64",
                    "name": "Citações Intimações Nulidades Questões e Processos incidentes",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-65",
                    "name": "Direitos Humanos na Constituição Federal II",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-66",
                    "name": "Navegadores",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-67",
                    "name": "Conjuntos",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-68",
                    "name": "CTB",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-69",
                    "name": "Licitações II",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-70",
                    "name": "Prescrições e Decadências",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-71",
                    "name": "Direitos Políticos",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-72",
                    "name": "Controle da Administração Pública",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-73",
                    "name": "Provas I",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-74",
                    "name": "Email",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-75",
                    "name": "Lei dos Juizados Especiais Criminais",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-76",
                    "name": "Operações",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-77",
                    "name": "Termos da Oração",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-78",
                    "name": "Direitos humanos na Constituição Federal III",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-79",
                    "name": "Crimes Contra a Pessoa",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-80",
                    "name": "Direito das Obrigações I",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-81",
                    "name": "Responsabilidade do Estado",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-82",
                    "name": "Constituição Brasileira e Tratados Internacionais",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-83",
                    "name": "Coordenação e Subordinação de Orações",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-84",
                    "name": "Frações Escala e Proporcionalidade",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-85",
                    "name": "Partidos Políticos",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-86",
                    "name": "Crimes Contra o Patrimônio",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-87",
                    "name": "Crimes ambientais",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-88",
                    "name": "Provas II",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-89",
                    "name": "Teoria Geral do Estado",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-90",
                    "name": "Direito das Obrigações II",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-91",
                    "name": "Prisão Cautelar I",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-92",
                    "name": "Lei dos Crimes Contra o Consumidor",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-93",
                    "name": "Segurança da Informaçaõ II",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-94",
                    "name": "Regra de Três",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-95",
                    "name": "Emprego de Sinais de Pontuação",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-96",
                    "name": "Crimes Contra Diginidade Sexual e Contra Incolumidade Pública",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-97",
                    "name": "Teoria Geral dos Contratos",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-98",
                    "name": "Estatuto dos Servidores Federais",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-99",
                    "name": "Crimes Contra a Fé Pública",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-100",
                    "name": "Porcentagem",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-101",
                    "name": "Concordância Verbal e Nominal",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-102",
                    "name": "Organização Criminosa",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-103",
                    "name": "Organização Pública",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-104",
                    "name": "Prisão Cautelar II",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-105",
                    "name": "Estatuto dos Servidores Federais II",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-106",
                    "name": "Processo Comum",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-107",
                    "name": "Contratos em Espécies",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-108",
                    "name": "Segurança Pública",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-109",
                    "name": "Crimes Praticados por Funcionário Público",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-110",
                    "name": "Regência Verbal/Nominal e Crase",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-111",
                    "name": "Equações e Inequações",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          },
          {
                    "id": "cont-112",
                    "name": "Procedimentos Especiais",
                    "color": "bg-emerald-100 text-emerald-700 border-emerald-300"
          },
          {
                    "id": "cont-113",
                    "name": "Responsabilidade Civíl da Propriedade",
                    "color": "bg-purple-100 text-purple-700 border-purple-300"
          },
          {
                    "id": "cont-114",
                    "name": "Lei de Execução Penal",
                    "color": "bg-amber-100 text-amber-700 border-amber-300"
          },
          {
                    "id": "cont-115",
                    "name": "Coesão e Coerência",
                    "color": "bg-rose-100 text-rose-700 border-rose-300"
          },
          {
                    "id": "cont-116",
                    "name": "Crimes Praticados por Particular Contra a Administração Pública",
                    "color": "bg-indigo-100 text-indigo-700 border-indigo-300"
          },
          {
                    "id": "cont-117",
                    "name": "Crimes Contra a Administração Estrangeira Contra a Admnistração da Justiça e Contra as Finanças Públicas",
                    "color": "bg-cyan-100 text-cyan-700 border-cyan-300"
          },
          {
                    "id": "cont-118",
                    "name": "Semântica e Substituição de Palavras",
                    "color": "bg-orange-100 text-orange-700 border-orange-300"
          },
          {
                    "id": "cont-119",
                    "name": "JECRIM",
                    "color": "bg-teal-100 text-teal-700 border-teal-300"
          },
          {
                    "id": "cont-120",
                    "name": "Lei de Execução Penal II",
                    "color": "bg-pink-100 text-pink-700 border-pink-300"
          },
          {
                    "id": "cont-121",
                    "name": "Lei de Improbidade Admnistrativa",
                    "color": "bg-blue-100 text-blue-700 border-blue-300"
          }
]
      },
      {
        id: 'p-taxa',
        name: 'Taxa de acerto',
        type: 'formula',
        formulaConfig: {
          expression: 'if(prop("Feitas") > 0, round((prop("Acertos") / prop("Feitas")) * 100, 1) + "%", "N/A")',
        },
      },
      {
        id: 'p-taxa-cespe',
        name: 'Taxa de acerto Cespe',
        type: 'formula',
        formulaConfig: {
          expression: 'if(prop("Feitas") > 0, round(((prop("Acertos") - prop("Erros")) / prop("Feitas")) * 100, 1) + "%", "N/A")',
        },
      },
      {
        id: 'p-total',
        name: 'Total de questões',
        type: 'number',
        numberFormat: 'number',
      },
      {
        id: 'p-feitas',
        name: 'Feitas',
        type: 'number',
        numberFormat: 'number',
      },
      {
        id: 'p-acertos',
        name: 'Acertos',
        type: 'number',
        numberFormat: 'number',
      },
      {
        id: 'p-erros',
        name: 'Erros',
        type: 'number',
        numberFormat: 'number',
      },
      {
        id: 'p-tempo',
        name: 'Tempo de estudo (líquido)',
        type: 'number',
        numberFormat: 'number',
      },
      {
        id: 'p-created',
        name: 'Created time',
        type: 'created_time',
      },
    ],
  };

  await db.databases.put(dbBlocoEstudos);

  // 4. Populate 408 exact records
  const records: RecordItem[] = [
    {
      "id": "rec-bloco-1",
      "databaseId": "db-bloco-estudos",
      "order": 0,
      "createdAt": "2026-03-01T20:36:00.000Z",
      "updatedAt": "2026-03-01T20:36:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "00",
            "p-conteudo": "Ortografia e Acentuação Gráfica",
            "p-total": null,
            "p-feitas": 7,
            "p-acertos": 5,
            "p-erros": 2,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-2",
      "databaseId": "db-bloco-estudos",
      "order": 1,
      "createdAt": "2026-03-01T20:45:00.000Z",
      "updatedAt": "2026-03-01T20:45:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "00",
            "p-conteudo": "Princípios do Direito Penal",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 5,
            "p-erros": 5,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-3",
      "databaseId": "db-bloco-estudos",
      "order": 2,
      "createdAt": "2026-03-01T20:45:00.000Z",
      "updatedAt": "2026-03-01T20:45:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "00",
            "p-conteudo": "Redes de computadores 1",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-4",
      "databaseId": "db-bloco-estudos",
      "order": 3,
      "createdAt": "2026-03-04T21:08:00.000Z",
      "updatedAt": "2026-03-04T21:08:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-5",
      "databaseId": "db-bloco-estudos",
      "order": 4,
      "createdAt": "2026-03-05T12:18:00.000Z",
      "updatedAt": "2026-03-05T12:18:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "00",
            "p-conteudo": "Proposições simples",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-6",
      "databaseId": "db-bloco-estudos",
      "order": 5,
      "createdAt": "2026-03-05T17:23:00.000Z",
      "updatedAt": "2026-03-05T17:23:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "00",
            "p-conteudo": "Juiz de garantia, Princípios do direito processual penal",
            "p-total": null,
            "p-feitas": 13,
            "p-acertos": 10,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-7",
      "databaseId": "db-bloco-estudos",
      "order": 6,
      "createdAt": "2026-03-05T17:33:00.000Z",
      "updatedAt": "2026-03-05T17:33:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "00",
            "p-conteudo": "Organização administrativa",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 10,
            "p-erros": 0,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-8",
      "databaseId": "db-bloco-estudos",
      "order": 7,
      "createdAt": "2026-03-06T09:57:00.000Z",
      "updatedAt": "2026-03-06T09:57:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "00",
            "p-conteudo": "Estatuto do desarmamento",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-9",
      "databaseId": "db-bloco-estudos",
      "order": 8,
      "createdAt": "2026-03-06T20:32:00.000Z",
      "updatedAt": "2026-03-06T20:32:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "00",
            "p-conteudo": "Ortografia e Acentuação Gráfica",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-10",
      "databaseId": "db-bloco-estudos",
      "order": 9,
      "createdAt": "2026-03-06T22:55:00.000Z",
      "updatedAt": "2026-03-06T22:55:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "00",
            "p-conteudo": "Princípios do Direito Penal",
            "p-total": null,
            "p-feitas": 13,
            "p-acertos": 9,
            "p-erros": 4,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-11",
      "databaseId": "db-bloco-estudos",
      "order": 10,
      "createdAt": "2026-03-09T11:58:00.000Z",
      "updatedAt": "2026-03-09T11:58:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "00",
            "p-conteudo": "Noções Gerais de Direito Civil",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-12",
      "databaseId": "db-bloco-estudos",
      "order": 11,
      "createdAt": "2026-03-09T14:10:00.000Z",
      "updatedAt": "2026-03-09T14:10:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "00",
            "p-conteudo": "Emprego do Hífen",
            "p-total": null,
            "p-feitas": 9,
            "p-acertos": 6,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-13",
      "databaseId": "db-bloco-estudos",
      "order": 12,
      "createdAt": "2026-03-09T20:16:00.000Z",
      "updatedAt": "2026-03-09T20:16:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "00",
            "p-conteudo": "Constituições",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-14",
      "databaseId": "db-bloco-estudos",
      "order": 13,
      "createdAt": "2026-03-10T13:30:00.000Z",
      "updatedAt": "2026-03-10T13:30:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "00",
            "p-conteudo": "Administração Pública, Organização administrativa",
            "p-total": null,
            "p-feitas": 18,
            "p-acertos": 14,
            "p-erros": 4,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-15",
      "databaseId": "db-bloco-estudos",
      "order": 14,
      "createdAt": "2026-03-10T14:40:00.000Z",
      "updatedAt": "2026-03-10T14:40:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "00",
            "p-conteudo": "Estatuto do desarmamento",
            "p-total": null,
            "p-feitas": 9,
            "p-acertos": 7,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-16",
      "databaseId": "db-bloco-estudos",
      "order": 15,
      "createdAt": "2026-03-10T18:37:00.000Z",
      "updatedAt": "2026-03-10T18:37:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "00",
            "p-conteudo": "Proposições compostas",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-17",
      "databaseId": "db-bloco-estudos",
      "order": 16,
      "createdAt": "2026-03-11T13:46:00.000Z",
      "updatedAt": "2026-03-11T13:46:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "00",
            "p-conteudo": "Teoria Geral dos Direitos Humanos",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-18",
      "databaseId": "db-bloco-estudos",
      "order": 17,
      "createdAt": "2026-03-13T17:51:00.000Z",
      "updatedAt": "2026-03-13T17:51:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "00",
            "p-conteudo": "Ortografia e Acentuação Gráfica",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-19",
      "databaseId": "db-bloco-estudos",
      "order": 18,
      "createdAt": "2026-03-13T17:54:00.000Z",
      "updatedAt": "2026-03-13T17:54:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "00",
            "p-conteudo": "Redes de computadores 1",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-20",
      "databaseId": "db-bloco-estudos",
      "order": 19,
      "createdAt": "2026-03-13T17:55:00.000Z",
      "updatedAt": "2026-03-13T17:55:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "01",
            "p-conteudo": "Substantivos; Adjetivos; Artigos; Numerais; Advérbios e Interjeições",
            "p-total": null,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-21",
      "databaseId": "db-bloco-estudos",
      "order": 20,
      "createdAt": "2026-03-16T14:33:00.000Z",
      "updatedAt": "2026-03-16T14:33:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "01",
            "p-conteudo": "Substantivos; Adjetivos; Artigos; Numerais; Advérbios e Interjeições",
            "p-total": null,
            "p-feitas": 8,
            "p-acertos": 8,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-22",
      "databaseId": "db-bloco-estudos",
      "order": 21,
      "createdAt": "2026-03-16T14:34:00.000Z",
      "updatedAt": "2026-03-16T14:34:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "01",
            "p-conteudo": "Aplicação da Lei Penal",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-23",
      "databaseId": "db-bloco-estudos",
      "order": 22,
      "createdAt": "2026-03-16T18:02:00.000Z",
      "updatedAt": "2026-03-16T18:02:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "01",
            "p-conteudo": "Redes de computadores 1",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-24",
      "databaseId": "db-bloco-estudos",
      "order": 23,
      "createdAt": "2026-03-17T12:16:00.000Z",
      "updatedAt": "2026-03-17T12:16:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "01",
            "p-conteudo": "Direito Fundamentais",
            "p-total": null,
            "p-feitas": 15,
            "p-acertos": 10,
            "p-erros": 5,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-25",
      "databaseId": "db-bloco-estudos",
      "order": 24,
      "createdAt": "2026-03-17T12:18:00.000Z",
      "updatedAt": "2026-03-17T12:18:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "00",
            "p-conteudo": "Teoria Geral dos Direitos Humanos",
            "p-total": null,
            "p-feitas": 6,
            "p-acertos": 3,
            "p-erros": 3,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-26",
      "databaseId": "db-bloco-estudos",
      "order": 25,
      "createdAt": "2026-03-17T13:34:00.000Z",
      "updatedAt": "2026-03-17T13:34:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "00",
            "p-conteudo": "Redes de computadores 1",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-27",
      "databaseId": "db-bloco-estudos",
      "order": 26,
      "createdAt": "2026-03-17T14:34:00.000Z",
      "updatedAt": "2026-03-17T14:34:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "01",
            "p-conteudo": "Equivalências Lógicas",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-28",
      "databaseId": "db-bloco-estudos",
      "order": 27,
      "createdAt": "2026-03-17T22:05:00.000Z",
      "updatedAt": "2026-03-17T22:05:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "01",
            "p-conteudo": "Inquerito Policial",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-29",
      "databaseId": "db-bloco-estudos",
      "order": 28,
      "createdAt": "2026-03-17T23:15:00.000Z",
      "updatedAt": "2026-03-17T23:15:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "01",
            "p-conteudo": "Inquerito Policial",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-30",
      "databaseId": "db-bloco-estudos",
      "order": 29,
      "createdAt": "2026-03-18T13:02:00.000Z",
      "updatedAt": "2026-03-18T13:02:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "01",
            "p-conteudo": "Estatais e fundações",
            "p-total": null,
            "p-feitas": 15,
            "p-acertos": 10,
            "p-erros": 5,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-31",
      "databaseId": "db-bloco-estudos",
      "order": 30,
      "createdAt": "2026-03-18T13:56:00.000Z",
      "updatedAt": "2026-03-18T13:56:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "01",
            "p-conteudo": "Lei de tortura",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-32",
      "databaseId": "db-bloco-estudos",
      "order": 31,
      "createdAt": "2026-03-18T20:10:00.000Z",
      "updatedAt": "2026-03-18T20:10:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "01",
            "p-conteudo": "Substantivos; Adjetivos; Artigos; Numerais; Advérbios e Interjeições",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-33",
      "databaseId": "db-bloco-estudos",
      "order": 32,
      "createdAt": "2026-03-19T13:24:00.000Z",
      "updatedAt": "2026-03-19T13:24:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "01",
            "p-conteudo": "Aplicação da Lei Penal",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 10,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-34",
      "databaseId": "db-bloco-estudos",
      "order": 33,
      "createdAt": "2026-03-20T14:03:00.000Z",
      "updatedAt": "2026-03-20T14:03:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "01",
            "p-conteudo": "Redes de computadores 2",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-35",
      "databaseId": "db-bloco-estudos",
      "order": 34,
      "createdAt": "2026-03-20T14:39:00.000Z",
      "updatedAt": "2026-03-20T14:39:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "01",
            "p-conteudo": "Das Pessoas físicas e domicílio",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 0.3
      }
},
    {
      "id": "rec-bloco-36",
      "databaseId": "db-bloco-estudos",
      "order": 35,
      "createdAt": "2026-03-21T19:51:00.000Z",
      "updatedAt": "2026-03-21T19:51:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "01",
            "p-conteudo": "Substantivos; Adjetivos; Artigos; Numerais; Advérbios e Interjeições",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 0.3
      }
},
    {
      "id": "rec-bloco-37",
      "databaseId": "db-bloco-estudos",
      "order": 36,
      "createdAt": "2026-03-23T13:09:00.000Z",
      "updatedAt": "2026-03-23T13:09:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "00",
            "p-conteudo": "Noções Gerais de Direito Civil",
            "p-total": null,
            "p-feitas": 7,
            "p-acertos": 3,
            "p-erros": 4,
            "p-tempo": 0.3
      }
},
    {
      "id": "rec-bloco-38",
      "databaseId": "db-bloco-estudos",
      "order": 37,
      "createdAt": "2026-03-25T13:10:00.000Z",
      "updatedAt": "2026-03-25T13:10:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "02",
            "p-conteudo": "Teoria do Delito I",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 3,
            "p-erros": 7,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-39",
      "databaseId": "db-bloco-estudos",
      "order": 38,
      "createdAt": "2026-03-25T14:12:00.000Z",
      "updatedAt": "2026-03-25T14:12:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "07",
            "p-conteudo": "Segurança da Informação I",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 9,
            "p-erros": 1,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-40",
      "databaseId": "db-bloco-estudos",
      "order": 39,
      "createdAt": "2026-03-25T19:13:00.000Z",
      "updatedAt": "2026-03-25T19:13:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "02",
            "p-conteudo": "Direitos e Deveres individuais e coletivos",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-41",
      "databaseId": "db-bloco-estudos",
      "order": 40,
      "createdAt": "2026-03-26T18:47:00.000Z",
      "updatedAt": "2026-03-26T18:47:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "02",
            "p-conteudo": "Aplicação da Lei Penal",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 2,
            "p-erros": 8,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-42",
      "databaseId": "db-bloco-estudos",
      "order": 41,
      "createdAt": "2026-03-27T19:55:00.000Z",
      "updatedAt": "2026-03-27T19:55:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 55,
            "p-feitas": 55,
            "p-acertos": 40,
            "p-erros": 15,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-43",
      "databaseId": "db-bloco-estudos",
      "order": 42,
      "createdAt": "2026-03-28T14:18:00.000Z",
      "updatedAt": "2026-03-28T14:18:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "02",
            "p-conteudo": "Deveres e Poderes administrativos",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-44",
      "databaseId": "db-bloco-estudos",
      "order": 43,
      "createdAt": "2026-03-28T18:50:00.000Z",
      "updatedAt": "2026-03-28T18:50:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "02",
            "p-conteudo": "Conjunções e Preposições",
            "p-total": null,
            "p-feitas": 30,
            "p-acertos": 18,
            "p-erros": 12,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-45",
      "databaseId": "db-bloco-estudos",
      "order": 44,
      "createdAt": "2026-03-28T21:25:00.000Z",
      "updatedAt": "2026-03-28T21:25:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "02",
            "p-conteudo": "Pessoas Jurídicas",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 2,
            "p-erros": 8,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-46",
      "databaseId": "db-bloco-estudos",
      "order": 45,
      "createdAt": "2026-03-30T14:54:00.000Z",
      "updatedAt": "2026-03-30T14:54:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "01",
            "p-conteudo": "Afirmação Histórica dos Direitos Humanos",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-47",
      "databaseId": "db-bloco-estudos",
      "order": 46,
      "createdAt": "2026-03-30T14:55:00.000Z",
      "updatedAt": "2026-03-30T14:55:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "02",
            "p-conteudo": "Lei de Drogas",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-48",
      "databaseId": "db-bloco-estudos",
      "order": 47,
      "createdAt": "2026-03-30T17:30:00.000Z",
      "updatedAt": "2026-03-30T17:30:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "01",
            "p-conteudo": "Equivalências Lógicas",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 0.25
      }
},
    {
      "id": "rec-bloco-49",
      "databaseId": "db-bloco-estudos",
      "order": 48,
      "createdAt": "2026-03-30T18:37:00.000Z",
      "updatedAt": "2026-03-30T18:37:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "01",
            "p-conteudo": "Algebra das expressões",
            "p-total": null,
            "p-feitas": 4,
            "p-acertos": 1,
            "p-erros": 3,
            "p-tempo": 0.35
      }
},
    {
      "id": "rec-bloco-50",
      "databaseId": "db-bloco-estudos",
      "order": 49,
      "createdAt": "2026-04-03T11:57:00.000Z",
      "updatedAt": "2026-04-03T11:57:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 50,
            "p-acertos": 37,
            "p-erros": 13,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-51",
      "databaseId": "db-bloco-estudos",
      "order": 50,
      "createdAt": "2026-04-07T09:40:00.000Z",
      "updatedAt": "2026-04-07T09:40:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "03",
            "p-conteudo": "Culpabilidade",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-52",
      "databaseId": "db-bloco-estudos",
      "order": 51,
      "createdAt": "2026-04-07T11:59:00.000Z",
      "updatedAt": "2026-04-07T11:59:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "03",
            "p-conteudo": "Direitos e Deveres Individuais e Coletivos II, Remédios constitucionais",
            "p-total": null,
            "p-feitas": 15,
            "p-acertos": 11,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-53",
      "databaseId": "db-bloco-estudos",
      "order": 52,
      "createdAt": "2026-04-08T14:38:00.000Z",
      "updatedAt": "2026-04-08T14:38:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "03",
            "p-conteudo": "Jurisdição e Competência",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-54",
      "databaseId": "db-bloco-estudos",
      "order": 53,
      "createdAt": "2026-04-13T03:12:00.000Z",
      "updatedAt": "2026-04-13T03:12:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "03",
            "p-conteudo": "Atos Administrativos",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-55",
      "databaseId": "db-bloco-estudos",
      "order": 54,
      "createdAt": "2026-04-13T03:13:00.000Z",
      "updatedAt": "2026-04-13T03:13:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "01",
            "p-conteudo": "Estatais e fundações",
            "p-total": null,
            "p-feitas": 11,
            "p-acertos": 6,
            "p-erros": 5,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-56",
      "databaseId": "db-bloco-estudos",
      "order": 55,
      "createdAt": "2026-04-13T03:13:00.000Z",
      "updatedAt": "2026-04-13T03:13:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "01",
            "p-conteudo": "Das Pessoas físicas e domicílio",
            "p-total": null,
            "p-feitas": 14,
            "p-acertos": 10,
            "p-erros": 4,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-57",
      "databaseId": "db-bloco-estudos",
      "order": 56,
      "createdAt": "2026-04-13T03:13:00.000Z",
      "updatedAt": "2026-04-13T03:13:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "01",
            "p-conteudo": "Direito Fundamentais",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-58",
      "databaseId": "db-bloco-estudos",
      "order": 57,
      "createdAt": "2026-04-13T03:13:00.000Z",
      "updatedAt": "2026-04-13T03:13:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "01",
            "p-conteudo": "Inquerito Policial",
            "p-total": null,
            "p-feitas": 12,
            "p-acertos": 9,
            "p-erros": 3,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-59",
      "databaseId": "db-bloco-estudos",
      "order": 58,
      "createdAt": "2026-04-13T03:13:00.000Z",
      "updatedAt": "2026-04-13T03:13:00.000Z",
      "values": {
            "p-materia": "",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-60",
      "databaseId": "db-bloco-estudos",
      "order": 59,
      "createdAt": "2026-04-13T03:18:00.000Z",
      "updatedAt": "2026-04-13T03:18:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "01",
            "p-conteudo": "Afirmação Histórica dos Direitos Humanos",
            "p-total": null,
            "p-feitas": 9,
            "p-acertos": 7,
            "p-erros": 2,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-61",
      "databaseId": "db-bloco-estudos",
      "order": 60,
      "createdAt": "2026-04-13T03:18:00.000Z",
      "updatedAt": "2026-04-13T03:18:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "01",
            "p-conteudo": "Redes de computadores 2",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-62",
      "databaseId": "db-bloco-estudos",
      "order": 61,
      "createdAt": "2026-04-13T03:19:00.000Z",
      "updatedAt": "2026-04-13T03:19:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "01",
            "p-conteudo": "Lei de tortura",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-63",
      "databaseId": "db-bloco-estudos",
      "order": 62,
      "createdAt": "2026-04-13T03:19:00.000Z",
      "updatedAt": "2026-04-13T03:19:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "01",
            "p-conteudo": "Substantivos; Adjetivos; Artigos; Numerais; Advérbios e Interjeições",
            "p-total": null,
            "p-feitas": 9,
            "p-acertos": 5,
            "p-erros": 4,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-64",
      "databaseId": "db-bloco-estudos",
      "order": 63,
      "createdAt": "2026-04-13T03:19:00.000Z",
      "updatedAt": "2026-04-13T03:19:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "01",
            "p-conteudo": "Algebra das expressões, Equivalências Lógicas",
            "p-total": null,
            "p-feitas": 13,
            "p-acertos": 8,
            "p-erros": 5,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-65",
      "databaseId": "db-bloco-estudos",
      "order": 64,
      "createdAt": "2026-04-13T03:21:00.000Z",
      "updatedAt": "2026-04-13T03:21:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 108,
            "p-feitas": 108,
            "p-acertos": 73,
            "p-erros": 35,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-66",
      "databaseId": "db-bloco-estudos",
      "order": 65,
      "createdAt": "2026-04-13T21:58:00.000Z",
      "updatedAt": "2026-04-13T21:58:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "03",
            "p-conteudo": "Atos Administrativos",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-67",
      "databaseId": "db-bloco-estudos",
      "order": 66,
      "createdAt": "2026-04-14T03:13:00.000Z",
      "updatedAt": "2026-04-14T03:13:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "03",
            "p-conteudo": "Computação em nuvem",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-68",
      "databaseId": "db-bloco-estudos",
      "order": 67,
      "createdAt": "2026-04-14T11:33:00.000Z",
      "updatedAt": "2026-04-14T11:33:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "03",
            "p-conteudo": "Dos Bens",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 5,
            "p-erros": 5,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-69",
      "databaseId": "db-bloco-estudos",
      "order": 68,
      "createdAt": "2026-04-14T13:31:00.000Z",
      "updatedAt": "2026-04-14T13:31:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "03",
            "p-conteudo": "Lei de Abuso de Autoridade",
            "p-total": null,
            "p-feitas": 13,
            "p-acertos": 12,
            "p-erros": 1,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-70",
      "databaseId": "db-bloco-estudos",
      "order": 69,
      "createdAt": "2026-04-14T18:17:00.000Z",
      "updatedAt": "2026-04-14T18:17:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "03",
            "p-conteudo": "PNHD",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-71",
      "databaseId": "db-bloco-estudos",
      "order": 70,
      "createdAt": "2026-04-14T19:26:00.000Z",
      "updatedAt": "2026-04-14T19:26:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "02",
            "p-conteudo": "Diagramas Lógicos",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-72",
      "databaseId": "db-bloco-estudos",
      "order": 71,
      "createdAt": "2026-04-14T22:45:00.000Z",
      "updatedAt": "2026-04-14T22:45:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "03",
            "p-conteudo": "Pronomes",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-73",
      "databaseId": "db-bloco-estudos",
      "order": 72,
      "createdAt": "2026-04-15T14:30:00.000Z",
      "updatedAt": "2026-04-15T14:30:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "02",
            "p-conteudo": "Direitos Humanos e Responsabilização do Estado",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-74",
      "databaseId": "db-bloco-estudos",
      "order": 73,
      "createdAt": "2026-04-16T13:13:00.000Z",
      "updatedAt": "2026-04-16T13:13:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "02",
            "p-conteudo": "Intranet e extranet",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 9,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-75",
      "databaseId": "db-bloco-estudos",
      "order": 74,
      "createdAt": "2026-04-16T20:19:00.000Z",
      "updatedAt": "2026-04-16T20:19:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "04",
            "p-conteudo": "Concurso de Pessoas",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 5,
            "p-erros": 5,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-76",
      "databaseId": "db-bloco-estudos",
      "order": 75,
      "createdAt": "2026-04-17T19:37:00.000Z",
      "updatedAt": "2026-04-17T19:37:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "04",
            "p-conteudo": "Proposições compostas, Verbos tempos e modos verbais.",
            "p-total": null,
            "p-feitas": 13,
            "p-acertos": 9,
            "p-erros": 4,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-77",
      "databaseId": "db-bloco-estudos",
      "order": 76,
      "createdAt": "2026-04-17T22:24:00.000Z",
      "updatedAt": "2026-04-17T22:24:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "04",
            "p-conteudo": "Direitos Sociais",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-78",
      "databaseId": "db-bloco-estudos",
      "order": 77,
      "createdAt": "2026-04-18T13:37:00.000Z",
      "updatedAt": "2026-04-18T13:37:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "04",
            "p-conteudo": "Sujeitos do Processo",
            "p-total": null,
            "p-feitas": 11,
            "p-acertos": 8,
            "p-erros": 3,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-79",
      "databaseId": "db-bloco-estudos",
      "order": 78,
      "createdAt": "2026-04-18T16:31:00.000Z",
      "updatedAt": "2026-04-18T16:31:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "04",
            "p-conteudo": "Ferramentas de Busca",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-80",
      "databaseId": "db-bloco-estudos",
      "order": 79,
      "createdAt": "2026-04-21T20:15:00.000Z",
      "updatedAt": "2026-04-21T20:15:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "04",
            "p-conteudo": "Dos Fatos Jurídicos e Negócios Jurídicos",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-81",
      "databaseId": "db-bloco-estudos",
      "order": 80,
      "createdAt": "2026-04-22T14:07:00.000Z",
      "updatedAt": "2026-04-22T14:07:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "04",
            "p-conteudo": "Direitos Humanos na Consituição Federal",
            "p-total": null,
            "p-feitas": 15,
            "p-acertos": 13,
            "p-erros": 2,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-82",
      "databaseId": "db-bloco-estudos",
      "order": 81,
      "createdAt": "2026-04-23T13:21:00.000Z",
      "updatedAt": "2026-04-23T13:21:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "04",
            "p-conteudo": "Estatudo da Criança e do Adolescente",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-83",
      "databaseId": "db-bloco-estudos",
      "order": 82,
      "createdAt": "2026-04-23T18:58:00.000Z",
      "updatedAt": "2026-04-23T18:58:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "04",
            "p-conteudo": "Licitações I",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 3
      }
},
    {
      "id": "rec-bloco-84",
      "databaseId": "db-bloco-estudos",
      "order": 83,
      "createdAt": "2026-04-23T20:30:00.000Z",
      "updatedAt": "2026-04-23T20:30:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "04",
            "p-conteudo": "Lógica de Argumentação",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-85",
      "databaseId": "db-bloco-estudos",
      "order": 84,
      "createdAt": "2026-04-24T12:30:00.000Z",
      "updatedAt": "2026-04-24T12:30:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "04",
            "p-conteudo": "Lógica de Argumentação",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-86",
      "databaseId": "db-bloco-estudos",
      "order": 85,
      "createdAt": "2026-04-24T13:25:00.000Z",
      "updatedAt": "2026-04-24T13:25:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "05",
            "p-conteudo": "Nacionalidade",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-87",
      "databaseId": "db-bloco-estudos",
      "order": 86,
      "createdAt": "2026-04-24T21:52:00.000Z",
      "updatedAt": "2026-04-24T21:52:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "05",
            "p-conteudo": "Extinção de punibilidade",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 5,
            "p-erros": 5,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-88",
      "databaseId": "db-bloco-estudos",
      "order": 87,
      "createdAt": "2026-04-28T18:19:00.000Z",
      "updatedAt": "2026-04-28T18:19:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 40,
            "p-feitas": 40,
            "p-acertos": 35,
            "p-erros": 5,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-89",
      "databaseId": "db-bloco-estudos",
      "order": 88,
      "createdAt": "2026-04-29T02:39:00.000Z",
      "updatedAt": "2026-04-29T02:39:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "05",
            "p-conteudo": "Ato Ilícito",
            "p-total": null,
            "p-feitas": 7,
            "p-acertos": 5,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-90",
      "databaseId": "db-bloco-estudos",
      "order": 89,
      "createdAt": "2026-04-29T15:28:00.000Z",
      "updatedAt": "2026-04-29T15:28:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "05",
            "p-conteudo": "Correlação e vozes verbais",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-91",
      "databaseId": "db-bloco-estudos",
      "order": 90,
      "createdAt": "2026-04-30T11:52:00.000Z",
      "updatedAt": "2026-04-30T11:52:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "05",
            "p-conteudo": "Citações Intimações Nulidades Questões e Processos incidentes",
            "p-total": null,
            "p-feitas": 7,
            "p-acertos": 5,
            "p-erros": 2,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-92",
      "databaseId": "db-bloco-estudos",
      "order": 91,
      "createdAt": "2026-04-30T13:42:00.000Z",
      "updatedAt": "2026-04-30T13:42:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "05",
            "p-conteudo": "Direitos Humanos na Constituição Federal II",
            "p-total": null,
            "p-feitas": 15,
            "p-acertos": 10,
            "p-erros": 5,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-93",
      "databaseId": "db-bloco-estudos",
      "order": 92,
      "createdAt": "2026-05-03T21:44:00.000Z",
      "updatedAt": "2026-05-03T21:44:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "05",
            "p-conteudo": "Navegadores",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-94",
      "databaseId": "db-bloco-estudos",
      "order": 93,
      "createdAt": "2026-05-04T14:15:00.000Z",
      "updatedAt": "2026-05-04T14:15:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 44,
            "p-acertos": 27,
            "p-erros": 17,
            "p-tempo": 1.6
      }
},
    {
      "id": "rec-bloco-95",
      "databaseId": "db-bloco-estudos",
      "order": 94,
      "createdAt": "2026-05-04T18:09:00.000Z",
      "updatedAt": "2026-05-04T18:09:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "05",
            "p-conteudo": "Conjuntos",
            "p-total": 10,
            "p-feitas": 7,
            "p-acertos": 6,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-96",
      "databaseId": "db-bloco-estudos",
      "order": 95,
      "createdAt": "2026-05-04T19:26:00.000Z",
      "updatedAt": "2026-05-04T19:26:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "05",
            "p-conteudo": "CTB",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-97",
      "databaseId": "db-bloco-estudos",
      "order": 96,
      "createdAt": "2026-05-04T23:04:00.000Z",
      "updatedAt": "2026-05-04T23:04:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "05",
            "p-conteudo": "Licitações II",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1.4
      }
},
    {
      "id": "rec-bloco-98",
      "databaseId": "db-bloco-estudos",
      "order": 97,
      "createdAt": "2026-05-05T13:18:00.000Z",
      "updatedAt": "2026-05-05T13:18:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "05",
            "p-conteudo": "Licitações II",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 6,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-99",
      "databaseId": "db-bloco-estudos",
      "order": 98,
      "createdAt": "2026-05-05T14:37:00.000Z",
      "updatedAt": "2026-05-05T14:37:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "05",
            "p-conteudo": "Licitações II",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 8,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-100",
      "databaseId": "db-bloco-estudos",
      "order": 99,
      "createdAt": "2026-05-05T19:17:00.000Z",
      "updatedAt": "2026-05-05T19:17:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "06",
            "p-conteudo": "Prescrições e Decadências",
            "p-total": 10,
            "p-feitas": 7,
            "p-acertos": 3,
            "p-erros": 4,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-101",
      "databaseId": "db-bloco-estudos",
      "order": 100,
      "createdAt": "2026-05-06T13:09:00.000Z",
      "updatedAt": "2026-05-06T13:09:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "06",
            "p-conteudo": "Direitos Políticos",
            "p-total": 12,
            "p-feitas": 11,
            "p-acertos": 11,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-102",
      "databaseId": "db-bloco-estudos",
      "order": 101,
      "createdAt": "2026-05-06T14:17:00.000Z",
      "updatedAt": "2026-05-06T14:17:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "06",
            "p-conteudo": "Controle da Administração Pública",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 9,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-103",
      "databaseId": "db-bloco-estudos",
      "order": 102,
      "createdAt": "2026-05-06T18:33:00.000Z",
      "updatedAt": "2026-05-06T18:33:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "06",
            "p-conteudo": "Provas I",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-104",
      "databaseId": "db-bloco-estudos",
      "order": 103,
      "createdAt": "2026-05-06T21:00:00.000Z",
      "updatedAt": "2026-05-06T21:00:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "06",
            "p-conteudo": "Email",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-105",
      "databaseId": "db-bloco-estudos",
      "order": 104,
      "createdAt": "2026-05-07T13:23:00.000Z",
      "updatedAt": "2026-05-07T13:23:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "06",
            "p-conteudo": "Lei dos Juizados Especiais Criminais",
            "p-total": 6,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-106",
      "databaseId": "db-bloco-estudos",
      "order": 105,
      "createdAt": "2026-05-07T14:16:00.000Z",
      "updatedAt": "2026-05-07T14:16:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "06",
            "p-conteudo": "Operações",
            "p-total": 15,
            "p-feitas": 12,
            "p-acertos": 10,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-107",
      "databaseId": "db-bloco-estudos",
      "order": 106,
      "createdAt": "2026-05-07T14:22:00.000Z",
      "updatedAt": "2026-05-07T14:22:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "06",
            "p-conteudo": "Termos da Oração",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 6,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-108",
      "databaseId": "db-bloco-estudos",
      "order": 107,
      "createdAt": "2026-05-07T19:47:00.000Z",
      "updatedAt": "2026-05-07T19:47:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 55,
            "p-feitas": 48,
            "p-acertos": 35,
            "p-erros": 13,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-109",
      "databaseId": "db-bloco-estudos",
      "order": 108,
      "createdAt": "2026-05-08T19:02:00.000Z",
      "updatedAt": "2026-05-08T19:02:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "06",
            "p-conteudo": "Direitos humanos na Constituição Federal III",
            "p-total": 20,
            "p-feitas": 17,
            "p-acertos": 14,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-110",
      "databaseId": "db-bloco-estudos",
      "order": 109,
      "createdAt": "2026-05-09T22:34:00.000Z",
      "updatedAt": "2026-05-09T22:34:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "06",
            "p-conteudo": "Crimes Contra a Pessoa",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 4,
            "p-erros": 6,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-111",
      "databaseId": "db-bloco-estudos",
      "order": 110,
      "createdAt": "2026-05-11T14:54:00.000Z",
      "updatedAt": "2026-05-11T14:54:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "07",
            "p-conteudo": "Direito das Obrigações I",
            "p-total": 10,
            "p-feitas": 4,
            "p-acertos": 1,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-112",
      "databaseId": "db-bloco-estudos",
      "order": 111,
      "createdAt": "2026-05-11T17:57:00.000Z",
      "updatedAt": "2026-05-11T17:57:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "07",
            "p-conteudo": "Responsabilidade do Estado",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-113",
      "databaseId": "db-bloco-estudos",
      "order": 112,
      "createdAt": "2026-05-11T20:03:00.000Z",
      "updatedAt": "2026-05-11T20:03:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "07",
            "p-conteudo": "Constituição Brasileira e Tratados Internacionais",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 5,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-114",
      "databaseId": "db-bloco-estudos",
      "order": 113,
      "createdAt": "2026-05-13T11:47:00.000Z",
      "updatedAt": "2026-05-13T11:47:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "07",
            "p-conteudo": "Coordenação e Subordinação de Orações",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-115",
      "databaseId": "db-bloco-estudos",
      "order": 114,
      "createdAt": "2026-05-13T11:50:00.000Z",
      "updatedAt": "2026-05-13T11:50:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "07",
            "p-conteudo": "Frações Escala e Proporcionalidade",
            "p-total": 10,
            "p-feitas": 7,
            "p-acertos": 7,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-116",
      "databaseId": "db-bloco-estudos",
      "order": 115,
      "createdAt": "2026-05-13T12:23:00.000Z",
      "updatedAt": "2026-05-13T12:23:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "07",
            "p-conteudo": "Partidos Políticos",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 9,
            "p-erros": 1,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-117",
      "databaseId": "db-bloco-estudos",
      "order": 116,
      "createdAt": "2026-05-13T19:35:00.000Z",
      "updatedAt": "2026-05-13T19:35:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "07",
            "p-conteudo": "Crimes Contra o Patrimônio",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-118",
      "databaseId": "db-bloco-estudos",
      "order": 117,
      "createdAt": "2026-05-13T20:05:00.000Z",
      "updatedAt": "2026-05-13T20:05:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "07",
            "p-conteudo": "Crimes ambientais",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-119",
      "databaseId": "db-bloco-estudos",
      "order": 118,
      "createdAt": "2026-05-14T14:59:00.000Z",
      "updatedAt": "2026-05-14T14:59:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 42,
            "p-acertos": 32,
            "p-erros": 10,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-120",
      "databaseId": "db-bloco-estudos",
      "order": 119,
      "createdAt": "2026-05-14T17:00:00.000Z",
      "updatedAt": "2026-05-14T17:00:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "07",
            "p-conteudo": "Provas II",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 10,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-121",
      "databaseId": "db-bloco-estudos",
      "order": 120,
      "createdAt": "2026-05-14T17:57:00.000Z",
      "updatedAt": "2026-05-14T17:57:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "07",
            "p-conteudo": "Crimes ambientais",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 10,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-122",
      "databaseId": "db-bloco-estudos",
      "order": 121,
      "createdAt": "2026-05-14T19:19:00.000Z",
      "updatedAt": "2026-05-14T19:19:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "07",
            "p-conteudo": "Crimes Contra o Patrimônio",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 9,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-123",
      "databaseId": "db-bloco-estudos",
      "order": 122,
      "createdAt": "2026-05-16T14:49:00.000Z",
      "updatedAt": "2026-05-16T14:49:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "07",
            "p-conteudo": "Provas II",
            "p-total": 15,
            "p-feitas": 13,
            "p-acertos": 10,
            "p-erros": 3,
            "p-tempo": 2.5
      }
},
    {
      "id": "rec-bloco-124",
      "databaseId": "db-bloco-estudos",
      "order": 123,
      "createdAt": "2026-05-18T17:27:00.000Z",
      "updatedAt": "2026-05-18T17:27:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "08",
            "p-conteudo": "Teoria Geral do Estado",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-125",
      "databaseId": "db-bloco-estudos",
      "order": 124,
      "createdAt": "2026-05-19T13:20:00.000Z",
      "updatedAt": "2026-05-19T13:20:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "08",
            "p-conteudo": "Teoria Geral do Estado",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-126",
      "databaseId": "db-bloco-estudos",
      "order": 125,
      "createdAt": "2026-05-19T15:02:00.000Z",
      "updatedAt": "2026-05-19T15:02:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "08",
            "p-conteudo": "Direito das Obrigações II",
            "p-total": 9,
            "p-feitas": 6,
            "p-acertos": 4,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-127",
      "databaseId": "db-bloco-estudos",
      "order": 126,
      "createdAt": "2026-05-21T11:49:00.000Z",
      "updatedAt": "2026-05-21T11:49:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 44,
            "p-acertos": 35,
            "p-erros": 9,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-128",
      "databaseId": "db-bloco-estudos",
      "order": 127,
      "createdAt": "2026-05-21T17:17:00.000Z",
      "updatedAt": "2026-05-21T17:17:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 46,
            "p-acertos": 44,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-129",
      "databaseId": "db-bloco-estudos",
      "order": 128,
      "createdAt": "2026-05-21T19:27:00.000Z",
      "updatedAt": "2026-05-21T19:27:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "01",
            "p-conteudo": "Aplicação da Lei Penal",
            "p-total": null,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-130",
      "databaseId": "db-bloco-estudos",
      "order": 129,
      "createdAt": "2026-05-21T19:46:00.000Z",
      "updatedAt": "2026-05-21T19:46:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "08",
            "p-conteudo": "Prisão Cautelar I",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-131",
      "databaseId": "db-bloco-estudos",
      "order": 130,
      "createdAt": "2026-05-21T19:46:00.000Z",
      "updatedAt": "2026-05-21T19:46:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "08",
            "p-conteudo": "Lei dos Crimes Contra o Consumidor",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-132",
      "databaseId": "db-bloco-estudos",
      "order": 131,
      "createdAt": "2026-05-23T12:02:00.000Z",
      "updatedAt": "2026-05-23T12:02:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "08",
            "p-conteudo": "Segurança da Informaçaõ II",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 6,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-133",
      "databaseId": "db-bloco-estudos",
      "order": 132,
      "createdAt": "2026-05-23T12:04:00.000Z",
      "updatedAt": "2026-05-23T12:04:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "08",
            "p-conteudo": "Regra de Três",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 6,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-134",
      "databaseId": "db-bloco-estudos",
      "order": 133,
      "createdAt": "2026-05-25T14:20:00.000Z",
      "updatedAt": "2026-05-25T14:20:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "08",
            "p-conteudo": "Emprego de Sinais de Pontuação",
            "p-total": 15,
            "p-feitas": 12,
            "p-acertos": 8,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-135",
      "databaseId": "db-bloco-estudos",
      "order": 134,
      "createdAt": "2026-05-25T20:25:00.000Z",
      "updatedAt": "2026-05-25T20:25:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "08",
            "p-conteudo": "Crimes Contra Diginidade Sexual e Contra Incolumidade Pública",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-136",
      "databaseId": "db-bloco-estudos",
      "order": 135,
      "createdAt": "2026-05-26T14:35:00.000Z",
      "updatedAt": "2026-05-26T14:35:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "08",
            "p-conteudo": "Crimes Contra Diginidade Sexual e Contra Incolumidade Pública",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 7,
            "p-erros": 1,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-137",
      "databaseId": "db-bloco-estudos",
      "order": 136,
      "createdAt": "2026-05-26T18:30:00.000Z",
      "updatedAt": "2026-05-26T18:30:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "09",
            "p-conteudo": "Teoria Geral dos Contratos",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 6,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-138",
      "databaseId": "db-bloco-estudos",
      "order": 137,
      "createdAt": "2026-05-27T00:23:00.000Z",
      "updatedAt": "2026-05-27T00:23:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "09",
            "p-conteudo": "Estatuto dos Servidores Federais",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-139",
      "databaseId": "db-bloco-estudos",
      "order": 138,
      "createdAt": "2026-05-27T13:59:00.000Z",
      "updatedAt": "2026-05-27T13:59:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "09",
            "p-conteudo": "Crimes Contra a Fé Pública",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 7,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-140",
      "databaseId": "db-bloco-estudos",
      "order": 139,
      "createdAt": "2026-05-28T16:36:00.000Z",
      "updatedAt": "2026-05-28T16:36:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "09",
            "p-conteudo": "Porcentagem",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-141",
      "databaseId": "db-bloco-estudos",
      "order": 140,
      "createdAt": "2026-05-28T17:27:00.000Z",
      "updatedAt": "2026-05-28T17:27:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "09",
            "p-conteudo": "Concordância Verbal e Nominal",
            "p-total": 13,
            "p-feitas": 12,
            "p-acertos": 8,
            "p-erros": 4,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-142",
      "databaseId": "db-bloco-estudos",
      "order": 141,
      "createdAt": "2026-05-28T21:21:00.000Z",
      "updatedAt": "2026-05-28T21:21:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "09",
            "p-conteudo": "Organização Criminosa",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 6,
            "p-erros": 2,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-143",
      "databaseId": "db-bloco-estudos",
      "order": 142,
      "createdAt": "2026-05-29T19:56:00.000Z",
      "updatedAt": "2026-05-29T19:56:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "09",
            "p-conteudo": "Organização Pública",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-144",
      "databaseId": "db-bloco-estudos",
      "order": 143,
      "createdAt": "2026-05-29T20:01:00.000Z",
      "updatedAt": "2026-05-29T20:01:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "09",
            "p-conteudo": "Prisão Cautelar II",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 7,
            "p-erros": 1,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-145",
      "databaseId": "db-bloco-estudos",
      "order": 144,
      "createdAt": "2026-05-30T15:04:00.000Z",
      "updatedAt": "2026-05-30T15:04:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 31,
            "p-erros": 14,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-146",
      "databaseId": "db-bloco-estudos",
      "order": 145,
      "createdAt": "2026-05-30T15:42:00.000Z",
      "updatedAt": "2026-05-30T15:42:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "09",
            "p-conteudo": "Organização Pública",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 5,
            "p-erros": 3,
            "p-tempo": 0.6
      }
},
    {
      "id": "rec-bloco-147",
      "databaseId": "db-bloco-estudos",
      "order": 146,
      "createdAt": "2026-05-31T21:49:00.000Z",
      "updatedAt": "2026-05-31T21:49:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "10",
            "p-conteudo": "Estatuto dos Servidores Federais II",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 7,
            "p-erros": 1,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-148",
      "databaseId": "db-bloco-estudos",
      "order": 147,
      "createdAt": "2026-06-01T12:50:00.000Z",
      "updatedAt": "2026-06-01T12:50:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "10",
            "p-conteudo": "Processo Comum",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-149",
      "databaseId": "db-bloco-estudos",
      "order": 148,
      "createdAt": "2026-06-01T14:39:00.000Z",
      "updatedAt": "2026-06-01T14:39:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "10",
            "p-conteudo": "Contratos em Espécies",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 8,
            "p-erros": 0,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-150",
      "databaseId": "db-bloco-estudos",
      "order": 149,
      "createdAt": "2026-06-01T20:45:00.000Z",
      "updatedAt": "2026-06-01T20:45:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "10",
            "p-conteudo": "Segurança Pública",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 5,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-151",
      "databaseId": "db-bloco-estudos",
      "order": 150,
      "createdAt": "2026-06-03T15:04:00.000Z",
      "updatedAt": "2026-06-03T15:04:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 54,
            "p-feitas": 48,
            "p-acertos": 33,
            "p-erros": 15,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-152",
      "databaseId": "db-bloco-estudos",
      "order": 151,
      "createdAt": "2026-06-08T23:02:00.000Z",
      "updatedAt": "2026-06-08T23:02:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 39,
            "p-erros": 6,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-153",
      "databaseId": "db-bloco-estudos",
      "order": 152,
      "createdAt": "2026-06-09T12:22:00.000Z",
      "updatedAt": "2026-06-09T12:22:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "10",
            "p-conteudo": "Crimes Praticados por Funcionário Público",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-154",
      "databaseId": "db-bloco-estudos",
      "order": 153,
      "createdAt": "2026-06-09T13:09:00.000Z",
      "updatedAt": "2026-06-09T13:09:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "10",
            "p-conteudo": "Regência Verbal/Nominal e Crase",
            "p-total": 15,
            "p-feitas": 13,
            "p-acertos": 9,
            "p-erros": 4,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-155",
      "databaseId": "db-bloco-estudos",
      "order": 154,
      "createdAt": "2026-06-09T21:09:00.000Z",
      "updatedAt": "2026-06-09T21:09:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "10",
            "p-conteudo": "Equações e Inequações",
            "p-total": 10,
            "p-feitas": 6,
            "p-acertos": 3,
            "p-erros": 3,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-156",
      "databaseId": "db-bloco-estudos",
      "order": 155,
      "createdAt": "2026-06-09T21:44:00.000Z",
      "updatedAt": "2026-06-09T21:44:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-157",
      "databaseId": "db-bloco-estudos",
      "order": 156,
      "createdAt": "2026-06-10T17:26:00.000Z",
      "updatedAt": "2026-06-10T17:26:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 55,
            "p-feitas": 51,
            "p-acertos": 38,
            "p-erros": 13,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-158",
      "databaseId": "db-bloco-estudos",
      "order": 157,
      "createdAt": "2026-06-10T19:55:00.000Z",
      "updatedAt": "2026-06-10T19:55:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "11",
            "p-conteudo": "Procedimentos Especiais",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 8,
            "p-erros": 1,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-159",
      "databaseId": "db-bloco-estudos",
      "order": 158,
      "createdAt": "2026-06-15T14:26:00.000Z",
      "updatedAt": "2026-06-15T14:26:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 35,
            "p-erros": 10,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-160",
      "databaseId": "db-bloco-estudos",
      "order": 159,
      "createdAt": "2026-06-16T13:11:00.000Z",
      "updatedAt": "2026-06-16T13:11:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 43,
            "p-acertos": 41,
            "p-erros": 2,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-161",
      "databaseId": "db-bloco-estudos",
      "order": 160,
      "createdAt": "2026-06-16T20:53:00.000Z",
      "updatedAt": "2026-06-16T20:53:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 34,
            "p-erros": 11,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-162",
      "databaseId": "db-bloco-estudos",
      "order": 161,
      "createdAt": "2026-06-18T19:14:00.000Z",
      "updatedAt": "2026-06-18T19:14:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "11",
            "p-conteudo": "Procedimentos Especiais",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 7,
            "p-erros": 1,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-163",
      "databaseId": "db-bloco-estudos",
      "order": 162,
      "createdAt": "2026-06-18T19:29:00.000Z",
      "updatedAt": "2026-06-18T19:29:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "11",
            "p-conteudo": "Responsabilidade Civíl da Propriedade",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 4,
            "p-erros": 5,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-164",
      "databaseId": "db-bloco-estudos",
      "order": 163,
      "createdAt": "2026-06-18T20:34:00.000Z",
      "updatedAt": "2026-06-18T20:34:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "11",
            "p-conteudo": "Lei de Execução Penal",
            "p-total": 9,
            "p-feitas": 6,
            "p-acertos": 4,
            "p-erros": 2,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-165",
      "databaseId": "db-bloco-estudos",
      "order": 164,
      "createdAt": "2026-06-18T20:47:00.000Z",
      "updatedAt": "2026-06-18T20:47:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "11",
            "p-conteudo": "Coesão e Coerência",
            "p-total": 9,
            "p-feitas": 9,
            "p-acertos": 8,
            "p-erros": 1,
            "p-tempo": 0.5
      }
},
    {
      "id": "rec-bloco-166",
      "databaseId": "db-bloco-estudos",
      "order": 165,
      "createdAt": "2026-06-20T21:51:00.000Z",
      "updatedAt": "2026-06-20T21:51:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "11",
            "p-conteudo": "Crimes Praticados por Particular Contra a Administração Pública",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 8,
            "p-erros": 2,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-167",
      "databaseId": "db-bloco-estudos",
      "order": 166,
      "createdAt": "2026-06-22T00:45:00.000Z",
      "updatedAt": "2026-06-22T00:45:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 49,
            "p-feitas": 45,
            "p-acertos": 32,
            "p-erros": 13,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-168",
      "databaseId": "db-bloco-estudos",
      "order": 167,
      "createdAt": "2026-06-22T14:44:00.000Z",
      "updatedAt": "2026-06-22T14:44:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 37,
            "p-erros": 8,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-169",
      "databaseId": "db-bloco-estudos",
      "order": 168,
      "createdAt": "2026-06-23T13:16:00.000Z",
      "updatedAt": "2026-06-23T13:16:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "12",
            "p-conteudo": "Crimes Contra a Administração Estrangeira Contra a Admnistração da Justiça e Contra as Finanças Públicas",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-170",
      "databaseId": "db-bloco-estudos",
      "order": 169,
      "createdAt": "2026-06-23T20:00:00.000Z",
      "updatedAt": "2026-06-23T20:00:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "",
            "p-conteudo": "Semântica e Substituição de Palavras",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-171",
      "databaseId": "db-bloco-estudos",
      "order": 170,
      "createdAt": "2026-06-25T14:03:00.000Z",
      "updatedAt": "2026-06-25T14:03:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 31,
            "p-erros": 14,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-172",
      "databaseId": "db-bloco-estudos",
      "order": 171,
      "createdAt": "2026-06-28T19:04:00.000Z",
      "updatedAt": "2026-06-28T19:04:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 31,
            "p-erros": 14,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-173",
      "databaseId": "db-bloco-estudos",
      "order": 172,
      "createdAt": "2026-07-01T13:15:00.000Z",
      "updatedAt": "2026-07-01T13:15:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 45,
            "p-acertos": 33,
            "p-erros": 12,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-174",
      "databaseId": "db-bloco-estudos",
      "order": 173,
      "createdAt": "2026-07-02T13:09:00.000Z",
      "updatedAt": "2026-07-02T13:09:00.000Z",
      "values": {
            "p-materia": "Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 50,
            "p-feitas": 46,
            "p-acertos": 36,
            "p-erros": 10,
            "p-tempo": 1.5
      }
},
    {
      "id": "rec-bloco-175",
      "databaseId": "db-bloco-estudos",
      "order": 174,
      "createdAt": "2026-07-07T16:23:00.000Z",
      "updatedAt": "2026-07-07T16:23:00.000Z",
      "values": {
            "p-materia": "Português, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-176",
      "databaseId": "db-bloco-estudos",
      "order": 175,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-177",
      "databaseId": "db-bloco-estudos",
      "order": 176,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Direito Penal, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-178",
      "databaseId": "db-bloco-estudos",
      "order": 177,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Direito Civil, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 1,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-179",
      "databaseId": "db-bloco-estudos",
      "order": 178,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-180",
      "databaseId": "db-bloco-estudos",
      "order": 179,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-181",
      "databaseId": "db-bloco-estudos",
      "order": 180,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-182",
      "databaseId": "db-bloco-estudos",
      "order": 181,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Informática, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-183",
      "databaseId": "db-bloco-estudos",
      "order": 182,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Legislação Penal, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-184",
      "databaseId": "db-bloco-estudos",
      "order": 183,
      "createdAt": "2026-07-07T16:29:00.000Z",
      "updatedAt": "2026-07-07T16:29:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico, Revisão",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-185",
      "databaseId": "db-bloco-estudos",
      "order": 184,
      "createdAt": "2026-07-15T12:06:00.000Z",
      "updatedAt": "2026-07-15T12:06:00.000Z",
      "values": {
            "p-materia": "Direito Penal, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-186",
      "databaseId": "db-bloco-estudos",
      "order": 185,
      "createdAt": "2026-07-15T12:10:00.000Z",
      "updatedAt": "2026-07-15T12:10:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-187",
      "databaseId": "db-bloco-estudos",
      "order": 186,
      "createdAt": "2026-07-15T12:10:00.000Z",
      "updatedAt": "2026-07-15T12:10:00.000Z",
      "values": {
            "p-materia": "Direito Civil, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-188",
      "databaseId": "db-bloco-estudos",
      "order": 187,
      "createdAt": "2026-07-15T12:11:00.000Z",
      "updatedAt": "2026-07-15T12:11:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-189",
      "databaseId": "db-bloco-estudos",
      "order": 188,
      "createdAt": "2026-07-15T12:11:00.000Z",
      "updatedAt": "2026-07-15T12:11:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-190",
      "databaseId": "db-bloco-estudos",
      "order": 189,
      "createdAt": "2026-07-15T12:11:00.000Z",
      "updatedAt": "2026-07-15T12:11:00.000Z",
      "values": {
            "p-materia": "Legislação Penal, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-191",
      "databaseId": "db-bloco-estudos",
      "order": 190,
      "createdAt": "2026-07-15T12:11:00.000Z",
      "updatedAt": "2026-07-15T12:11:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-192",
      "databaseId": "db-bloco-estudos",
      "order": 191,
      "createdAt": "2026-07-15T12:23:00.000Z",
      "updatedAt": "2026-07-15T12:23:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-193",
      "databaseId": "db-bloco-estudos",
      "order": 192,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-194",
      "databaseId": "db-bloco-estudos",
      "order": 193,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-195",
      "databaseId": "db-bloco-estudos",
      "order": 194,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-196",
      "databaseId": "db-bloco-estudos",
      "order": 195,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-197",
      "databaseId": "db-bloco-estudos",
      "order": 196,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-198",
      "databaseId": "db-bloco-estudos",
      "order": 197,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 4,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-199",
      "databaseId": "db-bloco-estudos",
      "order": 198,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-200",
      "databaseId": "db-bloco-estudos",
      "order": 199,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-201",
      "databaseId": "db-bloco-estudos",
      "order": 200,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-202",
      "databaseId": "db-bloco-estudos",
      "order": 201,
      "createdAt": "2026-07-15T15:02:00.000Z",
      "updatedAt": "2026-07-15T15:02:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-203",
      "databaseId": "db-bloco-estudos",
      "order": 202,
      "createdAt": "2026-07-16T23:34:00.000Z",
      "updatedAt": "2026-07-16T23:34:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-204",
      "databaseId": "db-bloco-estudos",
      "order": 203,
      "createdAt": "2026-07-16T23:34:00.000Z",
      "updatedAt": "2026-07-16T23:34:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-205",
      "databaseId": "db-bloco-estudos",
      "order": 204,
      "createdAt": "2026-07-16T23:34:00.000Z",
      "updatedAt": "2026-07-16T23:34:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 0,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-206",
      "databaseId": "db-bloco-estudos",
      "order": 205,
      "createdAt": "2026-07-16T23:34:00.000Z",
      "updatedAt": "2026-07-16T23:34:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-207",
      "databaseId": "db-bloco-estudos",
      "order": 206,
      "createdAt": "2026-07-16T23:34:00.000Z",
      "updatedAt": "2026-07-16T23:34:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-208",
      "databaseId": "db-bloco-estudos",
      "order": 207,
      "createdAt": "2026-07-16T23:40:00.000Z",
      "updatedAt": "2026-07-16T23:40:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-209",
      "databaseId": "db-bloco-estudos",
      "order": 208,
      "createdAt": "2026-07-16T23:41:00.000Z",
      "updatedAt": "2026-07-16T23:41:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-210",
      "databaseId": "db-bloco-estudos",
      "order": 209,
      "createdAt": "2026-07-16T23:41:00.000Z",
      "updatedAt": "2026-07-16T23:41:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-211",
      "databaseId": "db-bloco-estudos",
      "order": 210,
      "createdAt": "2026-07-16T23:41:00.000Z",
      "updatedAt": "2026-07-16T23:41:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 7,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-212",
      "databaseId": "db-bloco-estudos",
      "order": 211,
      "createdAt": "2026-07-16T23:41:00.000Z",
      "updatedAt": "2026-07-16T23:41:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-213",
      "databaseId": "db-bloco-estudos",
      "order": 212,
      "createdAt": "2026-07-19T23:57:00.000Z",
      "updatedAt": "2026-07-19T23:57:00.000Z",
      "values": {
            "p-materia": "Português, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-214",
      "databaseId": "db-bloco-estudos",
      "order": 213,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 3,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-215",
      "databaseId": "db-bloco-estudos",
      "order": 214,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Legislação Penal, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-216",
      "databaseId": "db-bloco-estudos",
      "order": 215,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-217",
      "databaseId": "db-bloco-estudos",
      "order": 216,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-218",
      "databaseId": "db-bloco-estudos",
      "order": 217,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Direito Penal, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-219",
      "databaseId": "db-bloco-estudos",
      "order": 218,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-220",
      "databaseId": "db-bloco-estudos",
      "order": 219,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Informática, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-221",
      "databaseId": "db-bloco-estudos",
      "order": 220,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-222",
      "databaseId": "db-bloco-estudos",
      "order": 221,
      "createdAt": "2026-07-19T23:59:00.000Z",
      "updatedAt": "2026-07-19T23:59:00.000Z",
      "values": {
            "p-materia": "Direito Civil, Revisão",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-223",
      "databaseId": "db-bloco-estudos",
      "order": 222,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-224",
      "databaseId": "db-bloco-estudos",
      "order": 223,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-225",
      "databaseId": "db-bloco-estudos",
      "order": 224,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-226",
      "databaseId": "db-bloco-estudos",
      "order": 225,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-227",
      "databaseId": "db-bloco-estudos",
      "order": 226,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-228",
      "databaseId": "db-bloco-estudos",
      "order": 227,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-229",
      "databaseId": "db-bloco-estudos",
      "order": 228,
      "createdAt": "2026-07-20T02:15:00.000Z",
      "updatedAt": "2026-07-20T02:15:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-230",
      "databaseId": "db-bloco-estudos",
      "order": 229,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-231",
      "databaseId": "db-bloco-estudos",
      "order": 230,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Informática, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-232",
      "databaseId": "db-bloco-estudos",
      "order": 231,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-233",
      "databaseId": "db-bloco-estudos",
      "order": 232,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-234",
      "databaseId": "db-bloco-estudos",
      "order": 233,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Legislação Penal, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-235",
      "databaseId": "db-bloco-estudos",
      "order": 234,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Direito Civil, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 2,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-236",
      "databaseId": "db-bloco-estudos",
      "order": 235,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-237",
      "databaseId": "db-bloco-estudos",
      "order": 236,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Direito Penal, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-238",
      "databaseId": "db-bloco-estudos",
      "order": 237,
      "createdAt": "2026-07-21T14:35:00.000Z",
      "updatedAt": "2026-07-21T14:35:00.000Z",
      "values": {
            "p-materia": "Português, Revisão",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-239",
      "databaseId": "db-bloco-estudos",
      "order": 238,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-240",
      "databaseId": "db-bloco-estudos",
      "order": 239,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Direito Penal, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-241",
      "databaseId": "db-bloco-estudos",
      "order": 240,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-242",
      "databaseId": "db-bloco-estudos",
      "order": 241,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-243",
      "databaseId": "db-bloco-estudos",
      "order": 242,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Direito Civil, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-244",
      "databaseId": "db-bloco-estudos",
      "order": 243,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Informática, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-245",
      "databaseId": "db-bloco-estudos",
      "order": 244,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-246",
      "databaseId": "db-bloco-estudos",
      "order": 245,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Português, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-247",
      "databaseId": "db-bloco-estudos",
      "order": 246,
      "createdAt": "2026-07-22T00:52:00.000Z",
      "updatedAt": "2026-07-22T00:52:00.000Z",
      "values": {
            "p-materia": "Legislação Penal, Revisão",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-248",
      "databaseId": "db-bloco-estudos",
      "order": 247,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-249",
      "databaseId": "db-bloco-estudos",
      "order": 248,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-250",
      "databaseId": "db-bloco-estudos",
      "order": 249,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-251",
      "databaseId": "db-bloco-estudos",
      "order": 250,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-252",
      "databaseId": "db-bloco-estudos",
      "order": 251,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Informática, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-253",
      "databaseId": "db-bloco-estudos",
      "order": 252,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Direito Penal, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-254",
      "databaseId": "db-bloco-estudos",
      "order": 253,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Português, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-255",
      "databaseId": "db-bloco-estudos",
      "order": 254,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-256",
      "databaseId": "db-bloco-estudos",
      "order": 255,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Direito Civil, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-257",
      "databaseId": "db-bloco-estudos",
      "order": 256,
      "createdAt": "2026-07-23T21:30:00.000Z",
      "updatedAt": "2026-07-23T21:30:00.000Z",
      "values": {
            "p-materia": "Legislação Penal, Revisão",
            "p-aula": "01",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-258",
      "databaseId": "db-bloco-estudos",
      "order": 257,
      "createdAt": "2026-07-30T18:58:00.000Z",
      "updatedAt": "2026-07-30T18:58:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-259",
      "databaseId": "db-bloco-estudos",
      "order": 258,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-260",
      "databaseId": "db-bloco-estudos",
      "order": 259,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-261",
      "databaseId": "db-bloco-estudos",
      "order": 260,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 1,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-262",
      "databaseId": "db-bloco-estudos",
      "order": 261,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-263",
      "databaseId": "db-bloco-estudos",
      "order": 262,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-264",
      "databaseId": "db-bloco-estudos",
      "order": 263,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-265",
      "databaseId": "db-bloco-estudos",
      "order": 264,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-266",
      "databaseId": "db-bloco-estudos",
      "order": 265,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-267",
      "databaseId": "db-bloco-estudos",
      "order": 266,
      "createdAt": "2026-07-30T19:00:00.000Z",
      "updatedAt": "2026-07-30T19:00:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-268",
      "databaseId": "db-bloco-estudos",
      "order": 267,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-269",
      "databaseId": "db-bloco-estudos",
      "order": 268,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-270",
      "databaseId": "db-bloco-estudos",
      "order": 269,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-271",
      "databaseId": "db-bloco-estudos",
      "order": 270,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-272",
      "databaseId": "db-bloco-estudos",
      "order": 271,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-273",
      "databaseId": "db-bloco-estudos",
      "order": 272,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-274",
      "databaseId": "db-bloco-estudos",
      "order": 273,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-275",
      "databaseId": "db-bloco-estudos",
      "order": 274,
      "createdAt": "2026-08-10T12:48:00.000Z",
      "updatedAt": "2026-08-10T12:48:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 1,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-276",
      "databaseId": "db-bloco-estudos",
      "order": 275,
      "createdAt": "2026-08-10T12:49:00.000Z",
      "updatedAt": "2026-08-10T12:49:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-277",
      "databaseId": "db-bloco-estudos",
      "order": 276,
      "createdAt": "2026-08-10T12:49:00.000Z",
      "updatedAt": "2026-08-10T12:49:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "03",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-278",
      "databaseId": "db-bloco-estudos",
      "order": 277,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-279",
      "databaseId": "db-bloco-estudos",
      "order": 278,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-280",
      "databaseId": "db-bloco-estudos",
      "order": 279,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-281",
      "databaseId": "db-bloco-estudos",
      "order": 280,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 3,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-282",
      "databaseId": "db-bloco-estudos",
      "order": 281,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-283",
      "databaseId": "db-bloco-estudos",
      "order": 282,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-284",
      "databaseId": "db-bloco-estudos",
      "order": 283,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-285",
      "databaseId": "db-bloco-estudos",
      "order": 284,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-286",
      "databaseId": "db-bloco-estudos",
      "order": 285,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-287",
      "databaseId": "db-bloco-estudos",
      "order": 286,
      "createdAt": "2026-08-11T12:27:00.000Z",
      "updatedAt": "2026-08-11T12:27:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-288",
      "databaseId": "db-bloco-estudos",
      "order": 287,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 1,
            "p-acertos": 1,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-289",
      "databaseId": "db-bloco-estudos",
      "order": 288,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 1,
            "p-erros": 4,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-290",
      "databaseId": "db-bloco-estudos",
      "order": 289,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-291",
      "databaseId": "db-bloco-estudos",
      "order": 290,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-292",
      "databaseId": "db-bloco-estudos",
      "order": 291,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-293",
      "databaseId": "db-bloco-estudos",
      "order": 292,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-294",
      "databaseId": "db-bloco-estudos",
      "order": 293,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-295",
      "databaseId": "db-bloco-estudos",
      "order": 294,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-296",
      "databaseId": "db-bloco-estudos",
      "order": 295,
      "createdAt": "2026-08-11T14:22:00.000Z",
      "updatedAt": "2026-08-11T14:22:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 4,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-297",
      "databaseId": "db-bloco-estudos",
      "order": 296,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-298",
      "databaseId": "db-bloco-estudos",
      "order": 297,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-299",
      "databaseId": "db-bloco-estudos",
      "order": 298,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-300",
      "databaseId": "db-bloco-estudos",
      "order": 299,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-301",
      "databaseId": "db-bloco-estudos",
      "order": 300,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-302",
      "databaseId": "db-bloco-estudos",
      "order": 301,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-303",
      "databaseId": "db-bloco-estudos",
      "order": 302,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-304",
      "databaseId": "db-bloco-estudos",
      "order": 303,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-305",
      "databaseId": "db-bloco-estudos",
      "order": 304,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-306",
      "databaseId": "db-bloco-estudos",
      "order": 305,
      "createdAt": "2026-08-12T15:38:00.000Z",
      "updatedAt": "2026-08-12T15:38:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "04",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-307",
      "databaseId": "db-bloco-estudos",
      "order": 306,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-308",
      "databaseId": "db-bloco-estudos",
      "order": 307,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-309",
      "databaseId": "db-bloco-estudos",
      "order": 308,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-310",
      "databaseId": "db-bloco-estudos",
      "order": 309,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-311",
      "databaseId": "db-bloco-estudos",
      "order": 310,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-312",
      "databaseId": "db-bloco-estudos",
      "order": 311,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-313",
      "databaseId": "db-bloco-estudos",
      "order": 312,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-314",
      "databaseId": "db-bloco-estudos",
      "order": 313,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-315",
      "databaseId": "db-bloco-estudos",
      "order": 314,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-316",
      "databaseId": "db-bloco-estudos",
      "order": 315,
      "createdAt": "2026-08-13T14:28:00.000Z",
      "updatedAt": "2026-08-13T14:28:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "02",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-317",
      "databaseId": "db-bloco-estudos",
      "order": 316,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-318",
      "databaseId": "db-bloco-estudos",
      "order": 317,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-319",
      "databaseId": "db-bloco-estudos",
      "order": 318,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-320",
      "databaseId": "db-bloco-estudos",
      "order": 319,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-321",
      "databaseId": "db-bloco-estudos",
      "order": 320,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-322",
      "databaseId": "db-bloco-estudos",
      "order": 321,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-323",
      "databaseId": "db-bloco-estudos",
      "order": 322,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-324",
      "databaseId": "db-bloco-estudos",
      "order": 323,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-325",
      "databaseId": "db-bloco-estudos",
      "order": 324,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-326",
      "databaseId": "db-bloco-estudos",
      "order": 325,
      "createdAt": "2026-08-14T13:25:00.000Z",
      "updatedAt": "2026-08-14T13:25:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-327",
      "databaseId": "db-bloco-estudos",
      "order": 326,
      "createdAt": "2026-08-15T13:51:00.000Z",
      "updatedAt": "2026-08-15T13:51:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "00",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-328",
      "databaseId": "db-bloco-estudos",
      "order": 327,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-329",
      "databaseId": "db-bloco-estudos",
      "order": 328,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-330",
      "databaseId": "db-bloco-estudos",
      "order": 329,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 1,
            "p-erros": 4,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-331",
      "databaseId": "db-bloco-estudos",
      "order": 330,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-332",
      "databaseId": "db-bloco-estudos",
      "order": 331,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-333",
      "databaseId": "db-bloco-estudos",
      "order": 332,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-334",
      "databaseId": "db-bloco-estudos",
      "order": 333,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-335",
      "databaseId": "db-bloco-estudos",
      "order": 334,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-336",
      "databaseId": "db-bloco-estudos",
      "order": 335,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 2,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-337",
      "databaseId": "db-bloco-estudos",
      "order": 336,
      "createdAt": "2026-08-15T13:52:00.000Z",
      "updatedAt": "2026-08-15T13:52:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "07",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-338",
      "databaseId": "db-bloco-estudos",
      "order": 337,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-339",
      "databaseId": "db-bloco-estudos",
      "order": 338,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-340",
      "databaseId": "db-bloco-estudos",
      "order": 339,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-341",
      "databaseId": "db-bloco-estudos",
      "order": 340,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-342",
      "databaseId": "db-bloco-estudos",
      "order": 341,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-343",
      "databaseId": "db-bloco-estudos",
      "order": 342,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-344",
      "databaseId": "db-bloco-estudos",
      "order": 343,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-345",
      "databaseId": "db-bloco-estudos",
      "order": 344,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-346",
      "databaseId": "db-bloco-estudos",
      "order": 345,
      "createdAt": "2026-08-17T20:15:00.000Z",
      "updatedAt": "2026-08-17T20:15:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "08",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-347",
      "databaseId": "db-bloco-estudos",
      "order": 346,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-348",
      "databaseId": "db-bloco-estudos",
      "order": 347,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-349",
      "databaseId": "db-bloco-estudos",
      "order": 348,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 1,
            "p-erros": 4,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-350",
      "databaseId": "db-bloco-estudos",
      "order": 349,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-351",
      "databaseId": "db-bloco-estudos",
      "order": 350,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-352",
      "databaseId": "db-bloco-estudos",
      "order": 351,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 1,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-353",
      "databaseId": "db-bloco-estudos",
      "order": 352,
      "createdAt": "2026-08-17T20:20:00.000Z",
      "updatedAt": "2026-08-17T20:20:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "11",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-354",
      "databaseId": "db-bloco-estudos",
      "order": 353,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-355",
      "databaseId": "db-bloco-estudos",
      "order": 354,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-356",
      "databaseId": "db-bloco-estudos",
      "order": 355,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-357",
      "databaseId": "db-bloco-estudos",
      "order": 356,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-358",
      "databaseId": "db-bloco-estudos",
      "order": 357,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-359",
      "databaseId": "db-bloco-estudos",
      "order": 358,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-360",
      "databaseId": "db-bloco-estudos",
      "order": 359,
      "createdAt": "2026-08-19T11:19:00.000Z",
      "updatedAt": "2026-08-19T11:19:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-361",
      "databaseId": "db-bloco-estudos",
      "order": 360,
      "createdAt": "2026-08-19T11:20:00.000Z",
      "updatedAt": "2026-08-19T11:20:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-362",
      "databaseId": "db-bloco-estudos",
      "order": 361,
      "createdAt": "2026-08-19T11:20:00.000Z",
      "updatedAt": "2026-08-19T11:20:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "09",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-363",
      "databaseId": "db-bloco-estudos",
      "order": 362,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-364",
      "databaseId": "db-bloco-estudos",
      "order": 363,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 1,
            "p-erros": 4,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-365",
      "databaseId": "db-bloco-estudos",
      "order": 364,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 2,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-366",
      "databaseId": "db-bloco-estudos",
      "order": 365,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-367",
      "databaseId": "db-bloco-estudos",
      "order": 366,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-368",
      "databaseId": "db-bloco-estudos",
      "order": 367,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-369",
      "databaseId": "db-bloco-estudos",
      "order": 368,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-370",
      "databaseId": "db-bloco-estudos",
      "order": 369,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-371",
      "databaseId": "db-bloco-estudos",
      "order": 370,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 2,
            "p-acertos": 2,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-372",
      "databaseId": "db-bloco-estudos",
      "order": 371,
      "createdAt": "2026-08-24T11:49:00.000Z",
      "updatedAt": "2026-08-24T11:49:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "05",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-373",
      "databaseId": "db-bloco-estudos",
      "order": 372,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-374",
      "databaseId": "db-bloco-estudos",
      "order": 373,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-375",
      "databaseId": "db-bloco-estudos",
      "order": 374,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-376",
      "databaseId": "db-bloco-estudos",
      "order": 375,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-377",
      "databaseId": "db-bloco-estudos",
      "order": 376,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-378",
      "databaseId": "db-bloco-estudos",
      "order": 377,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 3,
            "p-acertos": 0,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-379",
      "databaseId": "db-bloco-estudos",
      "order": 378,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-380",
      "databaseId": "db-bloco-estudos",
      "order": 379,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-381",
      "databaseId": "db-bloco-estudos",
      "order": 380,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-382",
      "databaseId": "db-bloco-estudos",
      "order": 381,
      "createdAt": "2026-08-24T19:34:00.000Z",
      "updatedAt": "2026-08-24T19:34:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "06",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-383",
      "databaseId": "db-bloco-estudos",
      "order": 382,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-384",
      "databaseId": "db-bloco-estudos",
      "order": 383,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-385",
      "databaseId": "db-bloco-estudos",
      "order": 384,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 2,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-386",
      "databaseId": "db-bloco-estudos",
      "order": 385,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-387",
      "databaseId": "db-bloco-estudos",
      "order": 386,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-388",
      "databaseId": "db-bloco-estudos",
      "order": 387,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 2,
            "p-erros": 3,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-389",
      "databaseId": "db-bloco-estudos",
      "order": 388,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Legislação",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-390",
      "databaseId": "db-bloco-estudos",
      "order": 389,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-391",
      "databaseId": "db-bloco-estudos",
      "order": 390,
      "createdAt": "2026-08-27T14:59:00.000Z",
      "updatedAt": "2026-08-27T14:59:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "10",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 1,
            "p-erros": 4,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-392",
      "databaseId": "db-bloco-estudos",
      "order": 391,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Informática",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-393",
      "databaseId": "db-bloco-estudos",
      "order": 392,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-394",
      "databaseId": "db-bloco-estudos",
      "order": 393,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Direito Constitucional",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 5,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-395",
      "databaseId": "db-bloco-estudos",
      "order": 394,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Português",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 3,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-396",
      "databaseId": "db-bloco-estudos",
      "order": 395,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Direito Penal",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-397",
      "databaseId": "db-bloco-estudos",
      "order": 396,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 3,
            "p-erros": 2,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-398",
      "databaseId": "db-bloco-estudos",
      "order": 397,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-399",
      "databaseId": "db-bloco-estudos",
      "order": 398,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Direitos Humanos",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 5,
            "p-acertos": 4,
            "p-erros": 1,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-400",
      "databaseId": "db-bloco-estudos",
      "order": 399,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Raciocínio Lógico",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-401",
      "databaseId": "db-bloco-estudos",
      "order": 400,
      "createdAt": "2026-08-31T13:43:00.000Z",
      "updatedAt": "2026-08-31T13:43:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": 5,
            "p-feitas": 4,
            "p-acertos": 4,
            "p-erros": 0,
            "p-tempo": null
      }
},
    {
      "id": "rec-bloco-402",
      "databaseId": "db-bloco-estudos",
      "order": 401,
      "createdAt": "2026-09-02T11:41:00.000Z",
      "updatedAt": "2026-09-02T11:41:00.000Z",
      "values": {
            "p-materia": "Direito Processual Penal",
            "p-aula": "12",
            "p-conteudo": "JECRIM",
            "p-total": 10,
            "p-feitas": 9,
            "p-acertos": 5,
            "p-erros": 4,
            "p-tempo": 0.8
      }
},
    {
      "id": "rec-bloco-403",
      "databaseId": "db-bloco-estudos",
      "order": 402,
      "createdAt": "2026-09-02T19:43:00.000Z",
      "updatedAt": "2026-09-02T19:43:00.000Z",
      "values": {
            "p-materia": "Direito Civil",
            "p-aula": "12",
            "p-conteudo": "Das Pessoas físicas e domicílio",
            "p-total": 10,
            "p-feitas": 8,
            "p-acertos": 6,
            "p-erros": 2,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-404",
      "databaseId": "db-bloco-estudos",
      "order": 403,
      "createdAt": "2026-09-03T14:43:00.000Z",
      "updatedAt": "2026-09-03T14:43:00.000Z",
      "values": {
            "p-materia": "Anki",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 5
      }
},
    {
      "id": "rec-bloco-405",
      "databaseId": "db-bloco-estudos",
      "order": 404,
      "createdAt": "2026-09-09T23:04:00.000Z",
      "updatedAt": "2026-09-09T23:04:00.000Z",
      "values": {
            "p-materia": "Anki",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 5
      }
},
    {
      "id": "rec-bloco-406",
      "databaseId": "db-bloco-estudos",
      "order": 405,
      "createdAt": "2026-09-10T00:54:00.000Z",
      "updatedAt": "2026-09-10T00:54:00.000Z",
      "values": {
            "p-materia": "Legislação Penal",
            "p-aula": "12",
            "p-conteudo": "Lei de Execução Penal II",
            "p-total": 10,
            "p-feitas": 10,
            "p-acertos": 6,
            "p-erros": 4,
            "p-tempo": 2
      }
},
    {
      "id": "rec-bloco-407",
      "databaseId": "db-bloco-estudos",
      "order": 406,
      "createdAt": "2026-09-10T13:55:00.000Z",
      "updatedAt": "2026-09-10T13:55:00.000Z",
      "values": {
            "p-materia": "Direito Administrativo",
            "p-aula": "12",
            "p-conteudo": "Lei de Improbidade Admnistrativa",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
    {
      "id": "rec-bloco-408",
      "databaseId": "db-bloco-estudos",
      "order": 407,
      "createdAt": "2026-09-10T14:32:00.000Z",
      "updatedAt": "2026-09-10T14:32:00.000Z",
      "values": {
            "p-materia": "Anki",
            "p-aula": "",
            "p-conteudo": "",
            "p-total": null,
            "p-feitas": null,
            "p-acertos": null,
            "p-erros": null,
            "p-tempo": 1
      }
},
  ];

  await db.records.bulkPut(records);
  console.log(`Successfully seeded ${records.length} Bloco de Estudos records into Dexie IndexedDB!`);
}

export async function resetAndReseedDatabase() {
  await db.records.where('databaseId').equals('db-bloco-estudos').delete();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('seed_version');
  }
  await seedInitialData();
}
