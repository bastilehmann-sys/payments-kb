import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '@/db/client';
import { documents, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const it = await db.select().from(countries).where(eq(countries.code, 'IT'));
  console.log('IT country document_id:', it[0]?.document_id);
  console.log('IT country name:', it[0]?.name);

  const docs = await db.select({id: documents.id, slug: documents.slug, source_file: documents.source_file, title: documents.title}).from(documents);
  console.log('All docs:', JSON.stringify(docs, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
