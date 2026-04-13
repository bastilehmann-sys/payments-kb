/**
 * Seed clearing_entries from content/expansion/clearing/*.md
 *
 * Reads YAML frontmatter via gray-matter, upserts via SELECT-first + INSERT/UPDATE pattern.
 * Source_row: uses max(source_row) + offset for new entries.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-clearing-expansion.ts
 */

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { db } from '@/db/client';
import { clearingEntries } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const CLEARING_DIR = path.join(process.cwd(), 'content', 'expansion', 'clearing');

interface ClearingFrontmatter {
  name: string;
  abkuerzung?: string;
  region?: string;
  typ?: string;
  waehrung?: string;
  betreiber?: string;
  status?: string;
  beschreibung_experte?: string;
  beschreibung_einsteiger?: string;
  aufbau?: string;
  settlement_modell?: string;
  cut_off?: string;
  teilnehmer?: string;
  relevanz_experte?: string;
  relevanz_einsteiger?: string;
  corporate_zugang_experte?: string;
  corporate_zugang_einsteiger?: string;
}

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s.length > 0 ? s : null;
}

/**
 * Map frontmatter fields to clearingEntries schema.
 * - waehrung → nachrichtenformat (best available column for currency info)
 * - aufbau → prepended to beschreibung_experte if present
 */
function mapToSchema(fm: ClearingFrontmatter, sourceRow: number): typeof clearingEntries.$inferInsert {
  // Combine aufbau into beschreibung_experte if present (schema has no aufbau column)
  const beschreibungExperte = fm.aufbau
    ? `${str(fm.beschreibung_experte)}\n\n--- Aufbau / Struktur ---\n${str(fm.aufbau)}`.trim()
    : strOrNull(fm.beschreibung_experte);

  // Store waehrung in nachrichtenformat (closest available schema column)
  const nachrichtenformat = fm.waehrung ? `Währung: ${str(fm.waehrung)}` : null;

  return {
    name: str(fm.name),
    abkuerzung: strOrNull(fm.abkuerzung),
    typ: strOrNull(fm.typ),
    region: strOrNull(fm.region),
    betreiber: strOrNull(fm.betreiber),
    beschreibung_experte: beschreibungExperte,
    beschreibung_einsteiger: strOrNull(fm.beschreibung_einsteiger),
    nachrichtenformat,
    settlement_modell: strOrNull(fm.settlement_modell),
    cut_off: strOrNull(fm.cut_off),
    teilnehmer: strOrNull(fm.teilnehmer),
    relevanz_experte: strOrNull(fm.relevanz_experte),
    relevanz_einsteiger: strOrNull(fm.relevanz_einsteiger),
    corporate_zugang_experte: strOrNull(fm.corporate_zugang_experte),
    corporate_zugang_einsteiger: strOrNull(fm.corporate_zugang_einsteiger),
    status: strOrNull(fm.status),
    source_row: sourceRow,
  };
}

async function main() {
  console.log('=== Seed Clearing Expansion ===\n');

  // 1. Read all MD files
  const files = fs.readdirSync(CLEARING_DIR).filter(f => f.endsWith('.md')).sort();
  console.log(`Found ${files.length} MD files in ${CLEARING_DIR}:\n`);
  files.forEach(f => console.log(`  • ${f}`));
  console.log();

  // 2. Get current max source_row
  const maxResult = await db.execute(sql`SELECT COALESCE(MAX(source_row), 0) AS max_row FROM clearing_entries`);
  const maxRow = Number((maxResult.rows[0] as Record<string, unknown>)['max_row'] ?? 0);
  console.log(`Current MAX source_row in clearing_entries: ${maxRow}\n`);

  // 3. Get current count before upsert
  const beforeCount = await db.execute(sql`SELECT COUNT(*) AS cnt FROM clearing_entries`);
  const countBefore = Number((beforeCount.rows[0] as Record<string, unknown>)['cnt'] ?? 0);

  let inserted = 0;
  let updated = 0;
  let sourceRowOffset = maxRow + 1;

  for (const file of files) {
    const filePath = path.join(CLEARING_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: fm } = matter(raw) as unknown as { data: ClearingFrontmatter };

    if (!fm.name) {
      console.warn(`  [SKIP] ${file} — no 'name' in frontmatter`);
      continue;
    }

    // Check if entry exists by abkuerzung (preferred) or name
    const lookupAbk = strOrNull(fm.abkuerzung);
    const lookupName = str(fm.name);

    let existing: { id: string }[] = [];

    if (lookupAbk) {
      existing = await db
        .select({ id: clearingEntries.id })
        .from(clearingEntries)
        .where(eq(clearingEntries.abkuerzung, lookupAbk))
        .limit(1);
    }

    if (existing.length === 0) {
      existing = await db
        .select({ id: clearingEntries.id })
        .from(clearingEntries)
        .where(eq(clearingEntries.name, lookupName))
        .limit(1);
    }

    if (existing.length > 0) {
      // UPDATE — keep the existing source_row
      const existingId = existing[0].id;
      const existingRow = await db
        .select({ source_row: clearingEntries.source_row })
        .from(clearingEntries)
        .where(eq(clearingEntries.id, existingId))
        .limit(1);

      const keepSourceRow = existingRow[0]?.source_row ?? sourceRowOffset++;
      const payload = mapToSchema(fm, keepSourceRow);

      await db
        .update(clearingEntries)
        .set(payload)
        .where(eq(clearingEntries.id, existingId));

      console.log(`  [UPDATE] ${file} → "${fm.name}" (id: ${existingId})`);
      updated++;
    } else {
      // INSERT
      const payload = mapToSchema(fm, sourceRowOffset++);
      await db.insert(clearingEntries).values(payload);
      console.log(`  [INSERT] ${file} → "${fm.name}" (source_row: ${payload.source_row})`);
      inserted++;
    }
  }

  // 4. Final count
  const afterCount = await db.execute(sql`SELECT COUNT(*) AS cnt FROM clearing_entries`);
  const countAfter = Number((afterCount.rows[0] as Record<string, unknown>)['cnt'] ?? 0);

  console.log('\n=== Summary ===');
  console.log(`  Files processed: ${files.length}`);
  console.log(`  Inserted:        ${inserted}`);
  console.log(`  Updated:         ${updated}`);
  console.log(`  Rows before:     ${countBefore}`);
  console.log(`  Rows after:      ${countAfter}`);
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
