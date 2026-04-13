import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import * as XLSX from 'xlsx';

const XLSX_PATH = path.join(process.env.HOME ?? '', 'Downloads/global_payments_db.xlsx');
const wb = XLSX.readFile(XLSX_PATH);

console.log('Available sheets:', wb.SheetNames);

// Find sheet 07
const sheet07 = wb.SheetNames.find((s: string) => s.includes('07') || s.toLowerCase().includes('ital'));
console.log('Sheet 07:', sheet07);

if (sheet07) {
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet07], {
    header: 1,
    defval: '',
    blankrows: true,
  }) as string[][];
  
  console.log(`Total rows: ${rows.length}`);
  
  for (let i = 0; i < Math.min(25, rows.length); i++) {
    console.log(`Row ${i+1}:`, JSON.stringify(rows[i]));
  }
  
  console.log('\n--- BLOCK detection ---');
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const col0 = String(r[0] ?? '').trim();
    if (/BLOCK\s+\d+/.test(col0)) {
      console.log(`Row ${i+1}: BLOCK HEADER -> ${JSON.stringify(r)}`);
    }
  }
  
  console.log('\n--- Last 5 rows ---');
  for (let i = Math.max(0, rows.length - 5); i < rows.length; i++) {
    console.log(`Row ${i+1}:`, JSON.stringify(rows[i]));
  }
}
