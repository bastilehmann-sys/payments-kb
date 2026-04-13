import { getZahlungsartEntries } from '@/lib/queries/entries';
import { ZahlungsartenGrid } from '@/components/browse/zahlungsarten-grid';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zahlungsarten — Payments KB',
};

export default async function ZahlungsartenPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getZahlungsartEntries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Zahlungsarten</h1>
        <p className="text-sm text-muted-foreground">
          Zahlungsarten, Cut-off-Zeiten und Value Dates: SEPA, SWIFT, Instant Payments und mehr.
          Klick auf eine Zeile für Details.
        </p>
      </div>

      <ZahlungsartenGrid data={data} />
    </div>
  );
}
