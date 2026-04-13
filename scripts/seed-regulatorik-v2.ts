/**
 * Seed regulatorik v2
 *
 * Drei Input-Quellen:
 *  1. content/expansion/regulatorik/*.md          — Deep-Dive-Files (21 neue + ggf. Bestand)
 *  2. content/expansion/regulatorik/_summaries-rewrite.md — rewritten beschreibung_einsteiger für 13 Bestands-Einträge
 *  3. content/expansion/regulatorik/_addon-fields.md      — 5 v2-Feldwerte für 13 Bestands-Einträge
 *
 * Upsert-Logik:
 *  - Bestand (kuerzel existiert in DB): UPDATE NUR auf Whitelist
 *     { beschreibung_einsteiger, verwandte_regulierungen, sap_bezug, bussgeld, pruefpflicht, aufwand_tshirt }
 *  - Neu (kuerzel existiert nicht): INSERT mit allen gelieferten Feldern, source_row = MAX+1
 *
 * Flags:
 *   --dry-run   Plant Changes, schreibt nichts
 *
 * Run:
 *   DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts [--dry-run]
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
const envPath = process.env.DOTENV_CONFIG_PATH
  ? path.resolve(process.env.DOTENV_CONFIG_PATH)
  : path.join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import fs from 'node:fs';
import matter from 'gray-matter';
import { db } from '@/db/client';
import { regulatorikEntries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const DRY_RUN = process.argv.includes('--dry-run');
const BASE = path.join(process.cwd(), 'content/expansion/regulatorik');

const V2_FIELDS = [
  'verwandte_regulierungen',
  'sap_bezug',
  'bussgeld',
  'pruefpflicht',
  'aufwand_tshirt',
] as const;

const BESTAND_WHITELIST = [
  'beschreibung_einsteiger',
  ...V2_FIELDS,
] as const;

const ALL_FIELDS = [
  'kuerzel', 'name', 'kategorie', 'typ',
  'beschreibung_experte', 'beschreibung_einsteiger',
  'geltungsbereich', 'status_version', 'in_kraft_seit', 'naechste_aenderung',
  'behoerde_link', 'betroffene_abteilungen',
  'auswirkungen_experte', 'auswirkungen_einsteiger',
  'pflichtmassnahmen_experte', 'pflichtmassnahmen_einsteiger',
  'best_practice_experte', 'best_practice_einsteiger',
  'risiken_experte', 'risiken_einsteiger',
  ...V2_FIELDS,
] as const;

// Keep TypeScript happy — reference BESTAND_WHITELIST so it's not unused
void BESTAND_WHITELIST;

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function parseSummariesFile(): Map<string, string> {
  const file = path.join(BASE, '_summaries-rewrite.md');
  if (!fs.existsSync(file)) return new Map();
  const content = fs.readFileSync(file, 'utf-8');
  const map = new Map<string, string>();
  const parts = content.split(/^## /m).slice(1); // first split-part is preamble
  for (const part of parts) {
    const [header, ...rest] = part.split('\n');
    const kuerzel = header.trim();
    const body = rest.join('\n').trim();
    if (kuerzel && body) map.set(kuerzel, body);
  }
  return map;
}

function parseAddonFile(): Map<string, Record<string, string | null>> {
  const file = path.join(BASE, '_addon-fields.md');
  if (!fs.existsSync(file)) return new Map();
  const content = fs.readFileSync(file, 'utf-8');
  const blocks = content.split(/\n---\n/).map(b => b.trim()).filter(Boolean);
  const map = new Map<string, Record<string, string | null>>();
  for (const block of blocks) {
    const wrapped = block.startsWith('---') ? block : `---\n${block}\n---\n`;
    const parsed = matter(wrapped);
    const fm = parsed.data as Record<string, unknown>;
    const kuerzel = strOrNull(fm.kuerzel);
    if (!kuerzel) continue;
    const fields: Record<string, string | null> = {};
    for (const f of V2_FIELDS) fields[f] = strOrNull(fm[f]);
    map.set(kuerzel, fields);
  }
  return map;
}

const BESTAND_FILES = new Set(['dora.md','mica.md','gdpr-payments.md','wtr-tfr.md','ecb-sepa-rulebook.md']);

function parseDeepDiveFiles(): Array<Record<string, string | null>> {
  const files = fs.readdirSync(BASE).filter(f =>
    f.endsWith('.md') && !f.startsWith('_') && !BESTAND_FILES.has(f)
  );
  return files.map(f => {
    const parsed = matter(fs.readFileSync(path.join(BASE, f), 'utf-8'));
    const fm = parsed.data as Record<string, unknown>;
    const rec: Record<string, string | null> = {};
    for (const field of ALL_FIELDS) rec[field] = strOrNull(fm[field]);
    return rec;
  });
}

async function main() {
  const summaries = parseSummariesFile();
  const addons = parseAddonFile();
  const newEntries = parseDeepDiveFiles();

  const existing = await db
    .select({ id: regulatorikEntries.id, kuerzel: regulatorikEntries.kuerzel, source_row: regulatorikEntries.source_row })
    .from(regulatorikEntries);
  const existingByKuerzel = new Map(existing.filter(e => e.kuerzel).map(e => [e.kuerzel!, e]));
  let maxRow = Math.max(0, ...existing.map(e => e.source_row ?? 0));

  // 1) Updates auf Bestand: Summary + 5 addon fields
  for (const [kuerzel, row] of existingByKuerzel) {
    const patch: Record<string, string | null> = {};
    if (summaries.has(kuerzel)) patch.beschreibung_einsteiger = summaries.get(kuerzel)!;
    const addon = addons.get(kuerzel);
    if (addon) for (const f of V2_FIELDS) if (addon[f] !== null) patch[f] = addon[f];
    if (Object.keys(patch).length === 0) continue;
    console.log(`UPDATE ${kuerzel}:`, Object.keys(patch).join(', '));
    if (!DRY_RUN) {
      await db.update(regulatorikEntries).set(patch).where(eq(regulatorikEntries.id, row.id));
    }
  }

  // 2) Inserts für neue Deep-Dives
  for (const rec of newEntries) {
    const kuerzel = rec.kuerzel;
    if (!kuerzel) { console.warn('SKIP: no kuerzel in deep-dive'); continue; }
    if (existingByKuerzel.has(kuerzel)) {
      console.log(`SKIP INSERT ${kuerzel} (already exists)`); continue;
    }
    maxRow += 1;
    const insertRow = { ...rec, source_row: maxRow };
    console.log(`INSERT ${kuerzel} (source_row ${maxRow})`);
    if (!DRY_RUN) {
      // @ts-expect-error — dynamic insert
      await db.insert(regulatorikEntries).values(insertRow);
    }
  }

  console.log(DRY_RUN ? '(dry run, nothing written)' : 'Done.');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
