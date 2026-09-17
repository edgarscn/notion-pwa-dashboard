const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\edgar\\.gemini\\antigravity\\brain\\05151791-0cb6-49f3-b4a8-f532a3e7a4f8\\.user_uploaded\\media_1789647935885.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
const headers = parseCSVLine(lines[0]);
const dataRows = lines.slice(1).map(parseCSVLine);

const colIdx = {};
headers.forEach((h, i) => {
  colIdx[h.trim()] = i;
});

const materiaSet = new Set();
const aulaSet = new Set();
const conteudoSet = new Set();

dataRows.forEach((row) => {
  const m = row[colIdx['Matéria']];
  const a = row[colIdx['Aula']];
  const c = row[colIdx['Conteúdo']];
  if (m) materiaSet.add(m);
  if (a) aulaSet.add(a);
  if (c) {
    c.split(/;|,/).forEach((item) => {
      if (item.trim()) conteudoSet.add(item.trim());
    });
  }
});

const colors = [
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-emerald-100 text-emerald-700 border-emerald-300',
  'bg-purple-100 text-purple-700 border-purple-300',
  'bg-amber-100 text-amber-700 border-amber-300',
  'bg-rose-100 text-rose-700 border-rose-300',
  'bg-indigo-100 text-indigo-700 border-indigo-300',
  'bg-cyan-100 text-cyan-700 border-cyan-300',
  'bg-orange-100 text-orange-700 border-orange-300',
  'bg-teal-100 text-teal-700 border-teal-300',
  'bg-pink-100 text-pink-700 border-pink-300',
];

const materiaOptions = Array.from(materiaSet).map((name, i) => ({
  id: `mat-${i + 1}`,
  name,
  color: colors[i % colors.length],
}));

const aulaOptions = Array.from(aulaSet).sort().map((name, i) => ({
  id: `aula-${i + 1}`,
  name,
  color: 'bg-gray-100 text-gray-700 border-gray-300',
}));

const conteudoOptions = Array.from(conteudoSet).map((name, i) => ({
  id: `cont-${i + 1}`,
  name,
  color: colors[i % colors.length],
}));

let seedTs = `import { db } from './index';
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
        options: ${JSON.stringify(materiaOptions, null, 10)}
      },
      {
        id: 'p-aula',
        name: 'Aula',
        type: 'select',
        options: ${JSON.stringify(aulaOptions, null, 10)}
      },
      {
        id: 'p-conteudo',
        name: 'Conteúdo',
        type: 'select',
        options: ${JSON.stringify(conteudoOptions, null, 10)}
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
`;

dataRows.forEach((row, i) => {
  const materia = row[colIdx['Matéria']] || '';
  const aula = row[colIdx['Aula']] || '';
  const conteudo = row[colIdx['Conteúdo']] || '';
  const total = row[colIdx['Total de questões']] !== '' && row[colIdx['Total de questões']] !== undefined ? Number(row[colIdx['Total de questões']]) : null;
  const feitas = row[colIdx['Feitas']] !== '' && row[colIdx['Feitas']] !== undefined ? Number(row[colIdx['Feitas']]) : null;
  const acertos = row[colIdx['Acertos']] !== '' && row[colIdx['Acertos']] !== undefined ? Number(row[colIdx['Acertos']]) : null;
  const erros = row[colIdx['Erros']] !== '' && row[colIdx['Erros']] !== undefined ? Number(row[colIdx['Erros']]) : null;
  const tempo = row[colIdx['Tempo de estudo (líquido)']] !== '' && row[colIdx['Tempo de estudo (líquido)']] !== undefined ? Number(row[colIdx['Tempo de estudo (líquido)']]) : null;
  const createdRaw = row[colIdx['Created time']] || '';

  let createdIso = new Date().toISOString();
  if (createdRaw) {
    const d = new Date(createdRaw);
    if (!isNaN(d.getTime())) {
      createdIso = d.toISOString();
    }
  }

  const recObj = {
    id: `rec-bloco-${i + 1}`,
    databaseId: 'db-bloco-estudos',
    order: i,
    createdAt: createdIso,
    updatedAt: createdIso,
    values: {
      'p-materia': materia,
      'p-aula': aula,
      'p-conteudo': conteudo,
      'p-total': total,
      'p-feitas': feitas,
      'p-acertos': acertos,
      'p-erros': erros,
      'p-tempo': tempo,
    },
  };

  seedTs += `    ${JSON.stringify(recObj, null, 6)},\n`;
});

seedTs += `  ];

  await db.records.bulkPut(records);
  console.log(\`Successfully seeded \${records.length} Bloco de Estudos records into Dexie IndexedDB!\`);
}

export async function resetAndReseedDatabase() {
  await db.records.where('databaseId').equals('db-bloco-estudos').delete();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('seed_version');
  }
  await seedInitialData();
}
`;

fs.writeFileSync('src/db/seed.ts', seedTs);
console.log('✅ Rebuilt src/db/seed.ts with resetAndReseedDatabase!');
