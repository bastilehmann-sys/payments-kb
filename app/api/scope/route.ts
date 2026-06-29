import { auth } from '@/auth';
import { db } from '@/db/client';
import { scopeAnalyses } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(scopeAnalyses)
    .orderBy(desc(scopeAnalyses.created_at))
    .limit(10);

  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as {
    name?: string;
    heimatland: string;
    ops_laender: string[];
    hausbank_laender: string[];
    flag_konzern: boolean;
    flag_s4hana: boolean;
    flag_dringend: boolean;
  };

  if (!body.heimatland || typeof body.heimatland !== 'string') {
    return Response.json({ error: 'heimatland required' }, { status: 400 });
  }

  const [row] = await db
    .insert(scopeAnalyses)
    .values({
      name:             body.name ?? null,
      heimatland:       body.heimatland,
      ops_laender:      body.ops_laender ?? [],
      hausbank_laender: body.hausbank_laender ?? [],
      flag_konzern:     body.flag_konzern ?? false,
      flag_s4hana:      body.flag_s4hana ?? false,
      flag_dringend:    body.flag_dringend ?? false,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
