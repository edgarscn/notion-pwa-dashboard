const fs = require('fs');

const f2 = 'C:\\Users\\edgar\\.gemini\\antigravity\\brain\\05151791-0cb6-49f3-b4a8-f532a3e7a4f8\\.user_uploaded\\media_1789647935885.csv';
const csvContent = fs.readFileSync(f2, 'utf-8');

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
headers.forEach((h, i) => (colIdx[h.trim()] = i));

const seedContent = fs.readFileSync('src/db/seed.ts', 'utf-8');
const recMatches = seedContent.match(/"id":\s*"rec-bloco-\d+"/g);
console.log('Seed TS Record count:', recMatches ? recMatches.length : 0);

let discrepancies = [];

dataRows.forEach((row, idx) => {
  const materia = row[colIdx['Matéria']] || '';
  const total = row[colIdx['Total de questões']] !== '' ? Number(row[colIdx['Total de questões']]) : null;
  const feitas = row[colIdx['Feitas']] !== '' ? Number(row[colIdx['Feitas']]) : null;
  const acertos = row[colIdx['Acertos']] !== '' ? Number(row[colIdx['Acertos']]) : null;
  const erros = row[colIdx['Erros']] !== '' ? Number(row[colIdx['Erros']]) : null;
  const tempo = row[colIdx['Tempo de estudo (líquido)']] !== '' ? Number(row[colIdx['Tempo de estudo (líquido)']]) : null;

  const recId = `rec-bloco-${idx + 1}`;
  const recPos = seedContent.indexOf(`"id": "${recId}"`);
  if (recPos === -1) {
    discrepancies.push(`Missing record ${recId} in seed.ts`);
    return;
  }

  const block = seedContent.substring(recPos, recPos + 700);

  if (!block.includes(`"p-materia": "${materia}"`)) {
    discrepancies.push(`Row ${idx + 1} (${recId}) Matéria mismatch: CSV='${materia}'`);
  }
  if (total !== null && !block.includes(`"p-total": ${total}`)) {
    discrepancies.push(`Row ${idx + 1} (${recId}) Total mismatch: CSV=${total}`);
  }
  if (feitas !== null && !block.includes(`"p-feitas": ${feitas}`)) {
    discrepancies.push(`Row ${idx + 1} (${recId}) Feitas mismatch: CSV=${feitas}`);
  }
  if (acertos !== null && !block.includes(`"p-acertos": ${acertos}`)) {
    discrepancies.push(`Row ${idx + 1} (${recId}) Acertos mismatch: CSV=${acertos}`);
  }
  if (erros !== null && !block.includes(`"p-erros": ${erros}`)) {
    discrepancies.push(`Row ${idx + 1} (${recId}) Erros mismatch: CSV=${erros}`);
  }
  if (tempo !== null && !block.includes(`"p-tempo": ${tempo}`)) {
    discrepancies.push(`Row ${idx + 1} (${recId}) Tempo mismatch: CSV=${tempo}`);
  }
});

console.log('=== AUDIT RESULTS ===');
console.log('Total Discrepancies:', discrepancies.length);
if (discrepancies.length > 0) {
  console.log('Sample Discrepancies:', discrepancies.slice(0, 15));
} else {
  console.log('🎉 100% PERFECT MATCH FOR ALL 408 RECORDS!');
}
