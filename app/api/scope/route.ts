import { auth } from '@/auth';
import { db } from '@/db/client';
import { scopeAnalyses } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(scopeAnalyses)
      .orderBy(desc(scopeAnalyses.created_at))
      .limit(10);
    return Response.json(rows);
  } catch (err) {
    console.error('[scope] GET error:', err);
    return Response.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body: {
    name?: string;
    heimatland: string;
    ops_laender: string[];
    hausbank_laender: string[];
    flag_konzern: boolean;
    flag_s4hana: boolean;
    flag_dringend: boolean;
  };

  try {
    body = await req.json() as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.heimatland || typeof body.heimatland !== 'string') {
    return Response.json({ error: 'heimatland required' }, { status: 400 });
  }

  const ops_laender = Array.isArray(body.ops_laender) ? body.ops_laender : [];
  const hausbank_laender = Array.isArray(body.hausbank_laender) ? body.hausbank_laender : [];

  try {
    const [row] = await db
      .insert(scopeAnalyses)
      .values({
        name:             body.name ?? null,
        heimatland:       body.heimatland,
        ops_laender,
        hausbank_laender,
        flag_konzern:     body.flag_konzern === true,
        flag_s4hana:      body.flag_s4hana === true,
        flag_dringend:    body.flag_dringend === true,
      })
      .returning();
    return Response.json(row, { status: 201 });
  } catch (err) {
    console.error('[scope] POST error:', err);
    return Response.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}
