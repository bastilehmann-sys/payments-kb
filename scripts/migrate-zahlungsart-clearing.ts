/**
 * Apply migration 0010: zahlungsart_clearing cross-link table
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/migrate-zahlungsart-clearing.ts
 */

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS zahlungsart_clearing (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      zahlungsart_id uuid NOT NULL REFERENCES zahlungsart_entries(id) ON DELETE CASCADE,
      clearing_id uuid NOT NULL REFERENCES clearing_entries(id) ON DELETE CASCADE,
      note text,
      is_primary boolean DEFAULT false,
      UNIQUE (zahlungsart_id, clearing_id)
    )
  `;
  console.log('Table zahlungsart_clearing created (or already exists).');

  await sql`CREATE INDEX IF NOT EXISTS zac_zahlungsart_idx ON zahlungsart_clearing (zahlungsart_id)`;
  await sql`CREATE INDEX IF NOT EXISTS zac_clearing_idx ON zahlungsart_clearing (clearing_id)`;
  console.log('Indexes created.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
