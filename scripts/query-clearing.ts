import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { db } from '@/db/client';
import { clearingEntries } from '@/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
  const rows = await db
    .select({ name: clearingEntries.name, abkuerzung: clearingEntries.abkuerzung, source_row: clearingEntries.source_row })
    .from(clearingEntries)
    .orderBy(clearingEntries.source_row);
  console.log(JSON.stringify(rows, null, 2));
  const maxRow = await db.select({ max: sql`MAX(source_row)` }).from(clearingEntries);
  console.log('MAX source_row:', maxRow[0].max);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
