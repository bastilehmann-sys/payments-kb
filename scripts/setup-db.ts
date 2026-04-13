import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from '../db/schema';
import * as fs from 'fs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function runRawSql(filePath: string): Promise<void> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const statements = content
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    console.log(`  Executing: ${stmt.substring(0, 60)}...`);
    await sql.query(stmt);
  }
}

async function main() {
  console.log('=== Payments KB Database Setup ===\n');

  // Step 1: Enable extensions
  console.log('[1/3] Enabling Postgres extensions...');
  await runRawSql(path.join(process.cwd(), 'db/migrations/0000_enable_pgvector.sql'));
  console.log('  Extensions enabled.\n');

  // Step 2: Run drizzle schema migrations (via journal)
  console.log('[2/3] Running schema migrations...');
  await migrate(db, { migrationsFolder: './db/migrations' });
  console.log('  Schema migrations complete.\n');

  // Step 3: Apply indexes
  console.log('[3/3] Creating indexes...');
  await runRawSql(path.join(process.cwd(), 'db/migrations/0002_indexes.sql'));
  console.log('  Indexes created.\n');

  // Verify: list tables
  console.log('Verifying tables in database...');
  const tables = await sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
  console.log('Tables found:');
  for (const row of tables) {
    console.log(`  - ${row.tablename}`);
  }

  console.log('\n=== Setup complete ===');
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
