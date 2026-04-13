import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getFormatVersions, getFormatEntries } from '@/lib/queries/entries';
import { FormatCompare } from '@/components/formate/format-compare';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Format-Vergleich — Payments KB',
};

export default async function FormateVergleichPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const [versions, entries] = await Promise.all([
    getFormatVersions().catch(() => []),
    getFormatEntries().catch(() => []),
  ]);

  return (
    <Suspense>
      <FormatCompare versions={versions} entries={entries} />
    </Suspense>
  );
}
