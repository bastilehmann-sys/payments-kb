import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countries, documents } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  // Find excel-italien document (Sheet 07 — richer, 92 rows)
  const excelItalyDocs = await db
    .select({ id: documents.id, slug: documents.slug, title: documents.title })
    .from(documents)
    .where(eq(documents.slug, 'excel-italien'))
    .limit(1);

  let docId: string | null = null;

  if (excelItalyDocs.length > 0) {
    docId = excelItalyDocs[0].id;
    console.log(`Using 'excel-italien' doc (Sheet 07): ${docId}`);
    console.log(`Title: ${excelItalyDocs[0].title}`);
  } else {
    // Fallback: gpdb_05_italien
    const italyDocs = await db
      .select({ id: documents.id, slug: documents.slug })
      .from(documents)
      .where(eq(documents.slug, 'italien'))
      .limit(1);
    if (italyDocs.length > 0) {
      docId = italyDocs[0].id;
      console.log(`Using fallback 'italien' doc: ${docId}`);
    }
  }

  if (!docId) {
    console.error('No Italy document found in documents table!');
    process.exit(1);
  }

  // Update the IT country row
  const result = await db
    .update(countries)
    .set({ document_id: docId })
    .where(eq(countries.code, 'IT'))
    .returning({ id: countries.id, code: countries.code, document_id: countries.document_id });

  if (result.length === 0) {
    console.error('IT country row not found!');
    process.exit(1);
  }

  console.log(`\nUpdated IT country row:`);
  console.log(`  id: ${result[0].id}`);
  console.log(`  code: ${result[0].code}`);
  console.log(`  document_id: ${result[0].document_id}`);
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
