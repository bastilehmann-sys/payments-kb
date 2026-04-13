/**
 * One-off migration: create country_blocks table + index.
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/migrate-country-blocks.ts
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Creating country_blocks table...');

  await sql`
    CREATE TABLE IF NOT EXISTS country_blocks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      country_code text NOT NULL,
      block_no int NOT NULL,
      block_title text NOT NULL,
      row_order int NOT NULL,
      feld text NOT NULL,
      experte text,
      einsteiger text,
      praxis text,
      created_at timestamptz DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS country_blocks_lookup
      ON country_blocks (country_code, block_no, row_order)
  `;

  console.log('Done. country_blocks table and index created.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
