import { auth } from '@/auth';
import { validateApiKey } from '@/lib/api-auth';
import { db } from '@/db/client';
import { documents } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await auth();
  if (!session && !validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const docs = await db
    .select({
      source_file: documents.source_file,
      section: documents.section,
      slug: documents.slug,
      title: documents.title,
      updated_at: documents.updated_at,
    })
    .from(documents)
    .orderBy(asc(documents.section));

  return Response.json({ documents: docs, total: docs.length });
}
