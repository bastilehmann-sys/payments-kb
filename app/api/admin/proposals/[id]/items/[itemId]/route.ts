import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface PatchBody {
  status?: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId } = await params;
  const body = await request.json() as PatchBody;

  const update: Partial<typeof proposalItems.$inferInsert> = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.comment !== undefined) update.comment = body.comment;

  if (Object.keys(update).length === 0) {
    return Response.json({ error: 'Nothing to update' }, { status: 400 });
  }

  await db
    .update(proposalItems)
    .set(update)
    .where(eq(proposalItems.id, itemId));

  return Response.json({ ok: true });
}
