import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
const sql = neon(process.env.DATABASE_URL);

async function main() {
  const r = await sql`SELECT COUNT(*) as cnt FROM format_versions`;
  console.log('Total format_versions:', r[0].cnt);
  const e = await sql`SELECT COUNT(*) as cnt FROM format_entries`;
  console.log('Total format_entries:', e[0].cnt);
  const n = await sql`SELECT COUNT(*) as cnt FROM format_versions WHERE notes IS NOT NULL AND notes != ''`;
  console.log('Versions with notes:', n[0].cnt);
}

main().catch(console.error);
