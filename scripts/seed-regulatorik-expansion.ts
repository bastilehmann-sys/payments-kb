/**
 * Seed regulatorik_entries from content/expansion/regulatorik/*.md
 *
 * For each MD file:
 *  1. Parse YAML frontmatter with gray-matter
 *  2. Upsert into regulatorik_entries (SELECT by kuerzel → INSERT or UPDATE)
 *  3. If body (Markdown content after frontmatter) is non-empty:
 *     - Upsert a document in `documents` with slug `regulatorik-${kuerzel.toLowerCase()}`
 *     - Chunk the body and (re)index chunks with tsvector
 *
 * Run:
 *   DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-expansion.ts
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
import { regulatorikEntries, documents, chunks } from '@/db/schema';
import { sql as sqlExpr, eq } from 'drizzle-orm';
import { sql as neonSql } from 'drizzle-orm';
import { chunkMarkdown } from '@/lib/ingest/chunk';
import { hash } from '@/lib/ingest/hash';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s.length > 0 ? s : null;
}

function extractTitle(md: string, fallback: string): string {
  const m = md.match(/^# (.+)$/m);
  return m ? m[1].trim() : fallback;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const expansionDir = path.join(process.cwd(), 'content', 'expansion', 'regulatorik');

  if (!fs.existsSync(expansionDir)) {
    console.error(`Directory not found: ${expansionDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(expansionDir).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No .md files found in', expansionDir);
    process.exit(0);
  }

  // Determine next available source_row
  const maxRowResult = await db.execute(
    neonSql`SELECT COALESCE(MAX(source_row), 0) AS max_row FROM regulatorik_entries`
  );
  let nextSourceRow = Number((maxRowResult.rows[0] as Record<string, unknown>)['max_row'] ?? 0) + 1;

  console.log(`\n=== Regulatorik Expansion Seed ===`);
  console.log(`Found ${files.length} file(s) in ${expansionDir}`);
  console.log(`Next source_row starts at: ${nextSourceRow}\n`);

  let inserted = 0;
  let updated = 0;
  let docsUpserted = 0;
  let chunksCreated = 0;

  for (const filename of files) {
    const filePath = path.join(expansionDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: fm, content: body } = matter(raw);

    const kuerzel = strOrNull(fm.kuerzel);
    const name = str(fm.name);

    if (!name) {
      console.warn(`  [SKIP] ${filename} — missing 'name' in frontmatter`);
      continue;
    }

    console.log(`  Processing: ${filename} (kuerzel=${kuerzel ?? 'null'}, name=${name})`);

    // Build entry payload
    const entryPayload = {
      kuerzel,
      name,
      kategorie: strOrNull(fm.kategorie),
      typ: strOrNull(fm.typ),
      beschreibung_experte: strOrNull(fm.beschreibung_experte),
      beschreibung_einsteiger: strOrNull(fm.beschreibung_einsteiger),
      geltungsbereich: strOrNull(fm.geltungsbereich),
      status_version: strOrNull(fm.status_version),
      in_kraft_seit: strOrNull(fm.in_kraft_seit),
      naechste_aenderung: strOrNull(fm.naechste_aenderung),
      behoerde_link: strOrNull(fm.behoerde_link),
      betroffene_abteilungen: strOrNull(fm.betroffene_abteilungen),
      auswirkungen_experte: strOrNull(fm.auswirkungen_experte),
      auswirkungen_einsteiger: strOrNull(fm.auswirkungen_einsteiger),
      pflichtmassnahmen_experte: strOrNull(fm.pflichtmassnahmen_experte),
      pflichtmassnahmen_einsteiger: strOrNull(fm.pflichtmassnahmen_einsteiger),
      best_practice_experte: strOrNull(fm.best_practice_experte),
      best_practice_einsteiger: strOrNull(fm.best_practice_einsteiger),
      risiken_experte: strOrNull(fm.risiken_experte),
      risiken_einsteiger: strOrNull(fm.risiken_einsteiger),
    };

    // SELECT by kuerzel (if available) or name
    let existingId: string | null = null;

    if (kuerzel) {
      const rows = await db
        .select({ id: regulatorikEntries.id })
        .from(regulatorikEntries)
        .where(eq(regulatorikEntries.kuerzel, kuerzel))
        .limit(1);
      if (rows.length > 0) existingId = rows[0].id;
    }

    if (!existingId) {
      // Also check by name to avoid duplicates
      const rows = await db
        .select({ id: regulatorikEntries.id })
        .from(regulatorikEntries)
        .where(eq(regulatorikEntries.name, name))
        .limit(1);
      if (rows.length > 0) existingId = rows[0].id;
    }

    if (existingId) {
      // UPDATE
      await db
        .update(regulatorikEntries)
        .set(entryPayload)
        .where(eq(regulatorikEntries.id, existingId));
      console.log(`    -> Updated entry (id=${existingId})`);
      updated++;
    } else {
      // INSERT with next source_row
      const newRows = await db
        .insert(regulatorikEntries)
        .values({ ...entryPayload, source_row: nextSourceRow })
        .returning({ id: regulatorikEntries.id });
      const newId = newRows[0].id;
      console.log(`    -> Inserted entry (id=${newId}, source_row=${nextSourceRow})`);
      nextSourceRow++;
      inserted++;
    }

    // --- Document + Chunks for body ---
    const bodyTrimmed = body.trim();
    if (!bodyTrimmed) {
      console.log(`    -> No body content — skipping document upsert`);
      continue;
    }

    const slug = `regulatorik-${(kuerzel ?? name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    const contentHash = hash(bodyTrimmed);
    const title = extractTitle(bodyTrimmed, name);
    const section = 'regulatorik';
    const sourceFile = `expansion/regulatorik/${filename}`;

    // Check existing document by slug
    const existingDocs = await db
      .select({ id: documents.id, content_hash: documents.content_hash })
      .from(documents)
      .where(eq(documents.slug, slug))
      .limit(1);

    let documentId: string;

    if (existingDocs.length > 0) {
      documentId = existingDocs[0].id;

      if (existingDocs[0].content_hash === contentHash) {
        console.log(`    -> Document unchanged (slug=${slug}) — skipping chunk rebuild`);
        docsUpserted++;
        continue;
      }

      // Update document + delete old chunks
      await db.delete(chunks).where(eq(chunks.document_id, documentId));
      await db
        .update(documents)
        .set({
          source_file: sourceFile,
          section,
          title,
          content_md: bodyTrimmed,
          content_hash: contentHash,
          updated_at: new Date(),
        })
        .where(eq(documents.id, documentId));
      console.log(`    -> Document updated (slug=${slug})`);
    } else {
      // Insert document
      const newDoc = await db
        .insert(documents)
        .values({
          source_file: sourceFile,
          section,
          slug,
          title,
          content_md: bodyTrimmed,
          content_hash: contentHash,
        })
        .returning({ id: documents.id });
      documentId = newDoc[0].id;
      console.log(`    -> Document inserted (slug=${slug}, id=${documentId})`);
    }

    docsUpserted++;

    // Insert chunks with tsvector
    const chunkList = chunkMarkdown(bodyTrimmed);
    let fileChunks = 0;

    for (const chunk of chunkList) {
      await db.execute(
        neonSql`
          INSERT INTO chunks (id, document_id, chunk_index, content, heading, tsv, metadata)
          VALUES (
            gen_random_uuid(),
            ${documentId},
            ${chunk.chunk_index},
            ${chunk.content},
            ${chunk.heading ?? null},
            to_tsvector('simple', ${chunk.content}),
            NULL
          )
        `
      );
      fileChunks++;
    }

    chunksCreated += fileChunks;
    console.log(`    -> Indexed ${fileChunks} chunk(s)`);
  }

  // Final count in regulatorik_entries
  const countResult = await db.execute(
    neonSql`SELECT COUNT(*) AS total FROM regulatorik_entries`
  );
  const total = (countResult.rows[0] as Record<string, unknown>)['total'];

  console.log(`\n=== Summary ===`);
  console.log(`  Entries inserted:  ${inserted}`);
  console.log(`  Entries updated:   ${updated}`);
  console.log(`  Documents upserted: ${docsUpserted}`);
  console.log(`  Chunks created:    ${chunksCreated}`);
  console.log(`  regulatorik_entries total: ${total}`);
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
