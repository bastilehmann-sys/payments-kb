import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const rows = await sql`SELECT version, LEFT(notes, 100) as preview FROM format_versions WHERE format_name = 'pain.001' ORDER BY version`;
  for (const r of rows) {
    console.log(r.version, '|', r.preview);
  }
}

main().catch(console.error);
