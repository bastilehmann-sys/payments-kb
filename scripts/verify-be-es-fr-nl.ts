import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

async function main() {
  const codes = ['BE', 'ES', 'FR', 'NL'];
  for (const code of codes) {
    const result = await db.execute(sql`select block_no, block_title, count(*)::int as rows from country_blocks where country_code = ${code} group by block_no, block_title order by block_no`);
    const rows = (result as unknown as { rows: { block_no: number; block_title: string; rows: number }[] }).rows ?? result;
    console.log(`\n=== ${code} ===`);
    for (const row of rows as { block_no: number; block_title: string; rows: number }[]) {
      console.log(`  Block ${row.block_no} "${row.block_title}": ${row.rows} rows`);
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
