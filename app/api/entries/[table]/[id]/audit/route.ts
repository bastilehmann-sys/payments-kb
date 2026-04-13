import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db/client';
import { entryAudit } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ table: string; id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { table, id } = await params;

  const rows = await db
    .select()
    .from(entryAudit)
    .where(
      and(
        eq(entryAudit.table_name, table),
        eq(entryAudit.row_id, id),
      ),
    )
    .orderBy(desc(entryAudit.edited_at))
    .limit(50);

  return NextResponse.json(rows);
}
