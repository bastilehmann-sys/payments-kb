/**
 * One-off script: print row 3 (index 2, the header row) of sheets 01-05
 * from global_payments_db.xlsx.
 *
 * Run: pnpm tsx scripts/inspect-excel.ts
 */

import * as path from 'path';
import * as XLSX from 'xlsx';

const XLSX_PATH = path.join(
  process.env.HOME ?? '',
  'Downloads/global_payments_db.xlsx'
);

const wb = XLSX.readFile(XLSX_PATH);

console.log('=== Available Sheets ===');
console.log(wb.SheetNames);
console.log();

// Inspect sheets 01-05 (first 5 non-country sheets)
const TARGET_SHEETS = wb.SheetNames.filter(
  (name) =>
    name.startsWith('01') ||
    name.startsWith('02') ||
    name.startsWith('03') ||
    name.startsWith('04') ||
    name.startsWith('05')
);

for (const sheetName of TARGET_SHEETS) {
  const ws = wb.Sheets[sheetName];
  const rawRows: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(
    ws,
    {
      header: 1,
      defval: '',
      blankrows: true,
    }
  );

  console.log(`\n=== ${sheetName} ===`);
  console.log('Row 1:', rawRows[0]?.map((v, i) => `[${i}] ${v}`).join(' | '));
  console.log('Row 2:', rawRows[1]?.map((v, i) => `[${i}] ${v}`).join(' | '));
  console.log('Row 3 (headers):', rawRows[2]?.map((v, i) => `[${i}] "${v}"`).join(' | '));
  console.log('Row 4 (first data):', rawRows[3]?.map((v, i) => `[${i}] "${String(v).substring(0, 40)}"`).join(' | '));
  console.log('Row 5:', rawRows[4]?.map((v, i) => `[${i}] "${String(v).substring(0, 40)}"`).join(' | '));
  console.log(`Total rows: ${rawRows.length}`);
}
