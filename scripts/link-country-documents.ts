/**
 * link-country-documents.ts
 *
 * Generic ingest script for country deep-profile markdown files.
 *
 * For each .md file found in content/expansion/laender/:
 *   1. Parse YAML frontmatter → code, name
 *   2. Upsert a document row (slug = country-<code>, section = 'laender')
 *   3. Delete old chunks; insert new chunks with to_tsvector
 *   4. Update countries SET document_id = <doc_id> WHERE code = <code>
 *
 * Run:
 *   DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/link-country-documents.ts
 */

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { sql as neonSql, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { documents, chunks, countries } from '@/db/schema';
import { hash } from '@/lib/ingest/hash';
import { chunkMarkdown } from '@/lib/ingest/chunk';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractTitle(md: string, fallback: string): string {
  const m = md.match(/^# (.+)$/m);
  return m ? m[1].trim() : fallback;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const laenderDir = path.join(process.cwd(), 'content', 'expansion', 'laender');

  if (!fs.existsSync(laenderDir)) {
    console.error(`Directory not found: ${laenderDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(laenderDir)
    .filter((f) => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('No .md files found in content/expansion/laender/');
    process.exit(0);
  }

  console.log(`Found ${files.length} country profile(s) to process:\n`);

  const results: {
    file: string;
    code: string;
    name: string;
    status: 'inserted' | 'updated' | 'skipped';
    chunks: number;
    country_linked: boolean;
  }[] = [];

  for (const filename of files) {
    const filePath = path.join(laenderDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: contentMd } = matter(raw);

    const code: string = String(frontmatter.code ?? '').toUpperCase().trim();
    const name: string = String(frontmatter.name ?? filename.replace('.md', '')).trim();

    if (!code) {
      console.warn(`  SKIP ${filename}: no 'code' in frontmatter`);
      continue;
    }

    const slug = `country-${code.toLowerCase()}`;
    const sourceFile = `expansion/laender/${filename}`;
    const title = extractTitle(contentMd, `Länderprofil: ${name}`);
    const contentHash = hash(contentMd);

    // -----------------------------------------------------------------------
    // 1. Check existing document
    // -----------------------------------------------------------------------
    const existing = await db
      .select({ id: documents.id, content_hash: documents.content_hash })
      .from(documents)
      .where(eq(documents.slug, slug))
      .limit(1);

    let documentId: string;
    let fileStatus: 'inserted' | 'updated' | 'skipped';

    if (existing.length > 0) {
      documentId = existing[0].id;

      if (existing[0].content_hash === contentHash) {
        // Content unchanged — still ensure country is linked
        fileStatus = 'skipped';
        console.log(`  SKIP (unchanged) ${filename} [${code}]`);
      } else {
        // Update document
        await db
          .update(documents)
          .set({
            title,
            content_md: contentMd,
            content_hash: contentHash,
            source_file: sourceFile,
            section: 'laender',
            updated_at: new Date(),
          })
          .where(eq(documents.id, documentId));
        fileStatus = 'updated';
        console.log(`  UPDATE ${filename} [${code}]`);
      }
    } else {
      // Insert new document
      const inserted = await db
        .insert(documents)
        .values({
          slug,
          title,
          content_md: contentMd,
          content_hash: contentHash,
          source_file: sourceFile,
          section: 'laender',
        })
        .returning({ id: documents.id });
      documentId = inserted[0].id;
      fileStatus = 'inserted';
      console.log(`  INSERT ${filename} [${code}]`);
    }

    // -----------------------------------------------------------------------
    // 2. Re-chunk (always, unless skipped)
    // -----------------------------------------------------------------------
    let chunksCreated = 0;

    if (fileStatus !== 'skipped') {
      // Delete old chunks
      await db.delete(chunks).where(eq(chunks.document_id, documentId));

      // Insert new chunks
      const chunkList = chunkMarkdown(contentMd);
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
        chunksCreated++;
      }
      console.log(`    → ${chunksCreated} chunks created`);
    } else {
      // Count existing chunks for reporting
      const existing_chunks = await db
        .select({ id: chunks.id })
        .from(chunks)
        .where(eq(chunks.document_id, documentId));
      chunksCreated = existing_chunks.length;
      console.log(`    → ${chunksCreated} chunks already exist`);
    }

    // -----------------------------------------------------------------------
    // 3. Link country row
    // -----------------------------------------------------------------------
    const countryUpdate = await db
      .update(countries)
      .set({ document_id: documentId })
      .where(eq(countries.code, code))
      .returning({ id: countries.id, code: countries.code, document_id: countries.document_id });

    const linked = countryUpdate.length > 0;
    if (linked) {
      console.log(`    → countries.${code}: document_id = ${documentId}`);
    } else {
      console.warn(`    → WARNING: country '${code}' not found in countries table — document ingested but not linked`);
    }

    results.push({
      file: filename,
      code,
      name,
      status: fileStatus,
      chunks: chunksCreated,
      country_linked: linked,
    });
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log('SUMMARY');
  console.log('============================================================');
  console.log(
    `${'File'.padEnd(12)} ${'Code'.padEnd(5)} ${'Status'.padEnd(10)} ${'Chunks'.padEnd(8)} Linked`
  );
  console.log('─'.repeat(55));
  for (const r of results) {
    console.log(
      `${r.file.padEnd(12)} ${r.code.padEnd(5)} ${r.status.padEnd(10)} ${String(r.chunks).padEnd(8)} ${r.country_linked ? '✓' : '✗ NOT FOUND'}`
    );
  }

  const allLinked = results.every((r) => r.country_linked);
  const totalChunks = results.reduce((s, r) => s + r.chunks, 0);

  console.log('─'.repeat(55));
  console.log(`Total: ${results.length} files | ${totalChunks} chunks | All linked: ${allLinked ? 'YES' : 'NO — check warnings above'}`);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
