import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { db } from '@/db/client';
import { regulatorikEntries } from '@/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
  const rows = await db
    .select({
      kuerzel: regulatorikEntries.kuerzel,
      name: regulatorikEntries.name,
      typ: regulatorikEntries.typ,
      kategorie: regulatorikEntries.kategorie,
      source_row: regulatorikEntries.source_row,
    })
    .from(regulatorikEntries)
    .orderBy(regulatorikEntries.source_row);
  console.log('COUNT:', rows.length);
  console.log(JSON.stringify(rows, null, 2));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
