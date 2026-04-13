import { getClearingEntries } from '@/lib/queries/entries';
import { ClearingGrid } from '@/components/browse/clearing-grid';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clearing — Payments KB',
};

export default async function ClearingPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getClearingEntries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Clearing-Systeme</h1>
        <p className="text-sm text-muted-foreground">
          Clearing- und Settlement-Systeme: SEPA, SWIFT, nationale Zahlungssysteme.
          Klick auf eine Zeile für Details.
        </p>
      </div>

      <ClearingGrid data={data} />
    </div>
  );
}
