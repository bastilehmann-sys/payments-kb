import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Applying migration: format_versions table...');
  await sql.query(`
    CREATE TABLE IF NOT EXISTS format_versions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      format_name text NOT NULL,
      version text NOT NULL,
      released text,
      sample_file text,
      is_current boolean DEFAULT false,
      notes text,
      schema_uri text,
      source_standard text,
      UNIQUE (format_name, version)
    )
  `);
  console.log('Done: format_versions table created (or already existed).');
}

main().catch((e) => { console.error(e); process.exit(1); });
