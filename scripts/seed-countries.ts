import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import { db } from '@/db/client';
import { countries, documents } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

interface CountryEntry {
  code: string;
  name: string;
  complexity: string;
  summary: string;
}

async function main() {
  const filePath = path.join(process.cwd(), 'content', 'countries.json');
  const entries: CountryEntry[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(`Seeding ${entries.length} countries...`);

  // Find the document with slug='italien' for IT linking
  const italyDoc = await db
    .select({ id: documents.id })
    .from(documents)
    .where(eq(documents.slug, 'italien'))
    .limit(1);

  const italyDocId = italyDoc.length > 0 ? italyDoc[0].id : null;
  if (italyDocId) {
    console.log(`Found 'italien' document: ${italyDocId}`);
  } else {
    console.log(`No 'italien' document found — IT will be inserted without document_id`);
  }

  let upserted = 0;
  for (const entry of entries) {
    const documentId = entry.code === 'IT' ? italyDocId : null;

    await db
      .insert(countries)
      .values({
        code: entry.code,
        name: entry.name,
        complexity: entry.complexity,
        summary: entry.summary,
        document_id: documentId,
      })
      .onConflictDoUpdate({
        target: countries.code,
        set: {
          name: entry.name,
          complexity: entry.complexity,
          summary: entry.summary,
          document_id: documentId,
        },
      });

    upserted++;
    process.stdout.write(`  [${upserted}/${entries.length}] ${entry.code} — ${entry.name}\n`);
  }

  // Verify count
  const result = await db.execute(sql`SELECT COUNT(*) AS count FROM countries`);
  // NeonHttpQueryResult shape: { rows: Record<string, unknown>[] }
  const rows = result.rows as Array<Record<string, unknown>>;
  const total = rows[0]?.['count'] ?? '?';
  console.log(`\nDone. Total rows in countries table: ${total}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
