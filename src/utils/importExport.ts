import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Database, PropertySchema, RecordItem } from '../types';

export interface ParsedImportData {
  headers: string[];
  rows: Record<string, any>[];
}

export function parseCSVFile(file: File): Promise<ParsedImportData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve({
          headers,
          rows: results.data as Record<string, any>[],
        });
      },
      error: (error) => reject(error),
    });
  });
}

export function parseXLSXFile(file: File): Promise<ParsedImportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });

        if (!json || json.length === 0) {
          resolve({ headers: [], rows: [] });
          return;
        }

        const rawHeaders = (json[0] as any[]).map((h) => String(h || '').trim());
        const rawRows = json.slice(1);

        const rows: Record<string, any>[] = rawRows.map((r: any) => {
          const rowObj: Record<string, any> = {};
          rawHeaders.forEach((h, i) => {
            if (h) rowObj[h] = r[i] !== undefined ? r[i] : '';
          });
          return rowObj;
        });

        resolve({
          headers: rawHeaders.filter(Boolean),
          rows,
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function exportToCSV(database: Database, records: RecordItem[], calculateRollup?: (rec: RecordItem, prop: PropertySchema) => any) {
  const headers = database.properties.map((p) => p.name);

  const data = records.map((rec) => {
    const rowObj: Record<string, any> = {};
    database.properties.forEach((prop) => {
      let val = rec.values[prop.id];

      if (prop.type === 'select' || prop.type === 'status') {
        const opt = prop.options?.find((o) => o.id === val || o.name === val);
        val = opt ? opt.name : val;
      } else if (prop.type === 'rollup' && calculateRollup) {
        val = calculateRollup(rec, prop);
      } else if (prop.type === 'relation' && Array.isArray(val)) {
        val = val.join(', ');
      }

      rowObj[prop.name] = val !== undefined && val !== null ? val : '';
    });
    return rowObj;
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${database.title || 'database'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToXLSX(database: Database, records: RecordItem[], calculateRollup?: (rec: RecordItem, prop: PropertySchema) => any) {
  const data = records.map((rec) => {
    const rowObj: Record<string, any> = {};
    database.properties.forEach((prop) => {
      let val = rec.values[prop.id];

      if (prop.type === 'select' || prop.type === 'status') {
        const opt = prop.options?.find((o) => o.id === val || o.name === val);
        val = opt ? opt.name : val;
      } else if (prop.type === 'rollup' && calculateRollup) {
        val = calculateRollup(rec, prop);
      } else if (prop.type === 'relation' && Array.isArray(val)) {
        val = val.join(', ');
      }

      rowObj[prop.name] = val !== undefined && val !== null ? val : '';
    });
    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Database');
  XLSX.writeFile(workbook, `${database.title || 'database'}.xlsx`);
}
