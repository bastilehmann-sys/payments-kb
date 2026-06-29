import { auth } from '@/auth';
import { db } from '@/db/client';
import { scopeAnalyses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    await db.delete(scopeAnalyses).where(eq(scopeAnalyses.id, id));
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('[scope] DELETE error:', err);
    return Response.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}
