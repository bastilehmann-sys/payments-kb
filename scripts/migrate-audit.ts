/**
 * One-off migration: create entry_audit table + index.
 * Run: DOTENV_CONFIG_PATH=.env.local tsx scripts/migrate-audit.ts
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Creating entry_audit table...');

  await sql`
    CREATE TABLE IF NOT EXISTS entry_audit (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      table_name text NOT NULL,
      row_id uuid NOT NULL,
      field text NOT NULL,
      old_value text,
      new_value text,
      edited_at timestamptz DEFAULT now(),
      edited_by text DEFAULT 'shared'
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS entry_audit_lookup
      ON entry_audit (table_name, row_id, edited_at DESC)
  `;

  console.log('Done. entry_audit table and index created.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
