import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { db } from '@/db/client';
import { regulatorikEntries } from '@/db/schema';

async function main() {
  const rows = await db
    .select({
      kuerzel: regulatorikEntries.kuerzel,
      beschreibung_einsteiger: regulatorikEntries.beschreibung_einsteiger,
    })
    .from(regulatorikEntries)
    .orderBy(regulatorikEntries.source_row);
  for (const r of rows) {
    console.log('---', r.kuerzel, '---');
    console.log(r.beschreibung_einsteiger);
    console.log();
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
