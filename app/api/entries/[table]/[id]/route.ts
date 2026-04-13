import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
  countries,
  entryAudit,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';

// ─── Table whitelist ───────────────────────────────────────────────────────────

const TABLE_MAP = {
  regulatorik_entries: regulatorikEntries,
  format_entries:      formatEntries,
  clearing_entries:    clearingEntries,
  zahlungsart_entries: zahlungsartEntries,
  ihb_entries:         ihbEntries,
  countries:           countries,
} as const;

type AllowedTable = keyof typeof TABLE_MAP;

function isAllowedTable(t: string): t is AllowedTable {
  return t in TABLE_MAP;
}

// ─── GET /api/entries/[table]/[id] ────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ table: string; id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { table, id } = await params;
  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 400 });
  }

  const drizzleTable = TABLE_MAP[table];
  const typedTable = drizzleTable as typeof regulatorikEntries;
  const rows = await db.select().from(typedTable).where(eq(typedTable.id, id));

  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

// ─── PATCH /api/entries/[table]/[id] ─────────────────────────────────────────

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ table: string; id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { table, id } = await params;
  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 400 });
  }

  const body = await req.json() as { fields?: Record<string, string | null> };
  const incoming = body.fields ?? {};
  if (!incoming || Object.keys(incoming).length === 0) {
    return NextResponse.json({ updated: 0, fields: [] });
  }

  const drizzleTable = TABLE_MAP[table];
  const typedTable = drizzleTable as typeof regulatorikEntries;

  // Fetch current row
  const rows = await db.select().from(typedTable).where(eq(typedTable.id, id));
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const current = rows[0] as Record<string, unknown>;

  // Find truly changed fields (skip system columns)
  const SKIP = new Set(['id', 'created_at', 'source_row']);
  const changedFields: string[] = [];
  const changedValues: Record<string, string | null> = {};

  for (const [key, newVal] of Object.entries(incoming)) {
    if (SKIP.has(key)) continue;
    const oldVal = current[key] != null ? String(current[key]) : null;
    const newValStr = newVal != null ? String(newVal) : null;
    if (oldVal !== newValStr) {
      changedFields.push(key);
      changedValues[key] = newValStr;
    }
  }

  if (changedFields.length === 0) {
    return NextResponse.json({ updated: 0, fields: [] });
  }

  // Validate column names against safe identifier pattern
  const SAFE_ID = /^[a-z_][a-z0-9_]*$/;
  for (const f of changedFields) {
    if (!SAFE_ID.test(f)) {
      return NextResponse.json({ error: `Invalid field name: ${f}` }, { status: 400 });
    }
  }

  // Build parameterized UPDATE using neon's sql directly.
  // neon() returns a tagged-template sql function that supports parameterized queries.
  // We use neonClient.query() with a plain string + params array.
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const neonClient = neon(process.env.DATABASE_URL);

  const setClause = changedFields
    .map((f, i) => `"${f}" = $${i + 2}`)
    .join(', ');
  const updateValues: (string | null)[] = [id, ...changedFields.map((f) => changedValues[f])];

  await neonClient.query(`UPDATE "${table}" SET ${setClause} WHERE id = $1`, updateValues);

  // Insert audit rows
  const oldVals = changedFields.map((f) =>
    current[f] != null ? String(current[f]) : null
  );

  await db.insert(entryAudit).values(
    changedFields.map((f, i) => ({
      table_name: table,
      row_id: id,
      field: f,
      old_value: oldVals[i],
      new_value: changedValues[f],
      edited_by: 'shared',
    })),
  );

  return NextResponse.json({ updated: changedFields.length, fields: changedFields });
}
