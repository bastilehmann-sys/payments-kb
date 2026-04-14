/**
 * Seed zahlungsart_clearing cross-link table.
 * Run: pnpm tsx scripts/seed-zahlungsart-clearing-links.ts
 */

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

interface Row { id: string; name: string; abkuerzung?: string; kuerzel?: string }

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const sql = neon(process.env.DATABASE_URL);

  // Fetch all entries
  const zahlungsarten: Row[] = await sql`
    SELECT id, name, kuerzel FROM zahlungsart_entries ORDER BY source_row
  ` as Row[];

  const clearings: Row[] = await sql`
    SELECT id, name, abkuerzung FROM clearing_entries ORDER BY source_row
  ` as Row[];

  console.log(`Found ${zahlungsarten.length} Zahlungsarten, ${clearings.length} Clearing systems`);

  // Helper: find Zahlungsart by name/kuerzel fragment (case-insensitive)
  function findZ(fragment: string): Row | undefined {
    const q = fragment.toLowerCase();
    return zahlungsarten.find(
      (z) => z.name.toLowerCase().includes(q) || (z.kuerzel ?? '').toLowerCase().includes(q)
    );
  }

  // Helper: find Clearing by name/abkuerzung fragment (case-insensitive)
  function findC(fragment: string): Row | undefined {
    const q = fragment.toLowerCase();
    return clearings.find(
      (c) => c.name.toLowerCase().includes(q) || (c.abkuerzung ?? '').toLowerCase().includes(q)
    );
  }

  // Mapping table: [zahlungsartFragment, clearingFragment, note, isPrimary]
  type Mapping = [string, string, string, boolean];
  const MAPPINGS: Mapping[] = [
    // SCT (SEPA Credit Transfer)
    ['sepa credit transfer', 'step2',    'Standard für <100k EUR', true],
    ['sepa credit transfer', 'target2',  'Großbetrag >100k EUR',   false],
    // SCT Inst (SEPA Instant)
    ['sepa instant',         'tips',     '24/7, bis 100k EUR',     true],
    // SDD Core
    ['direct debit core',    'step2',    '',                       true],
    // SDD B2B
    ['direct debit b2b',     'step2',    '',                       true],
    // SWIFT
    ['swift international',  'swift',    '',                       true],
    // URGP
    ['urgent payment',       'target2',  'EU-RTGS',                true],
    ['urgent payment',       'chaps',    'UK-RTGS',                false],
    // US ACH
    ['us ach',               'us ach',   'Batch, Next-Day',        true],
    // Wire Transfer / Fedwire — SWIFT international is the closest Zahlungsart for USD wire
    // Map SWIFT to Fedwire and CHIPS as secondary USD wire clearing paths
    ['swift international',  'fedwire',  'Fed-RTGS für USD',       false],
    ['swift international',  'chips',    'Private Clearing Net',   false],
  ];

  let inserted = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [zFragment, cFragment, note, isPrimary] of MAPPINGS) {
    const z = findZ(zFragment);
    const c = findC(cFragment);

    if (!z) {
      console.warn(`  [NOT FOUND] Zahlungsart fragment: "${zFragment}"`);
      notFound++;
      continue;
    }
    if (!c) {
      console.warn(`  [NOT FOUND] Clearing fragment: "${cFragment}"`);
      notFound++;
      continue;
    }

    try {
      await sql`
        INSERT INTO zahlungsart_clearing (zahlungsart_id, clearing_id, note, is_primary)
        VALUES (${z.id}, ${c.id}, ${note || null}, ${isPrimary})
        ON CONFLICT (zahlungsart_id, clearing_id) DO UPDATE
          SET note = EXCLUDED.note,
              is_primary = EXCLUDED.is_primary
      `;
      console.log(`  [OK] ${z.name} → ${c.name} (primary=${isPrimary})`);
      inserted++;
    } catch (err) {
      console.error(`  [ERR] ${z.name} → ${c.name}:`, err);
      skipped++;
    }
  }

  // Additionally map all remaining clearing entries that have corresponding Zahlungsarten
  // via the clearing_system field on zahlungsart_entries (informational cross-reference)
  const additionalMappings: Mapping[] = [
    // ACH (US) Zahlungsart entry to US ACH clearing
    ['us ach credit',        'us ach',   'Batch-Clearing USA',     true],
    ['us ach credit',        'ach (us)', 'Allg. ACH-System USA',   false],
  ];

  for (const [zFragment, cFragment, note, isPrimary] of additionalMappings) {
    const z = findZ(zFragment);
    const c = findC(cFragment);
    if (!z || !c) continue;
    try {
      await sql`
        INSERT INTO zahlungsart_clearing (zahlungsart_id, clearing_id, note, is_primary)
        VALUES (${z.id}, ${c.id}, ${note || null}, ${isPrimary})
        ON CONFLICT (zahlungsart_id, clearing_id) DO UPDATE
          SET note = EXCLUDED.note,
              is_primary = EXCLUDED.is_primary
      `;
      console.log(`  [OK] ${z.name} → ${c.name} (primary=${isPrimary})`);
      inserted++;
    } catch (err) {
      console.error(`  [ERR] ${z.name} → ${c.name}:`, err);
      skipped++;
    }
  }

  console.log(`\nDone. Inserted/updated: ${inserted}, Not found: ${notFound}, Errors: ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
