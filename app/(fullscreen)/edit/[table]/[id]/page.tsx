import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
  countries,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { COLUMNS_FOR_TABLE } from '@/lib/browse/columns';
import { EntryEditor } from '@/components/edit/entry-editor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bearbeiten — Payments KB',
};

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

export default async function EditPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  const { table, id } = await params;
  if (!isAllowedTable(table)) redirect('/');

  const drizzleTable = TABLE_MAP[table];
  const typedTable = drizzleTable as typeof regulatorikEntries;
  const rows = await db.select().from(typedTable).where(eq(typedTable.id, id));
  if (!rows[0]) redirect('/');

  const entry = rows[0] as Record<string, unknown>;
  const columns = COLUMNS_FOR_TABLE[table] ?? [];

  return (
    <EntryEditor
      table={table}
      id={id}
      initial={entry}
      columns={columns}
    />
  );
}
