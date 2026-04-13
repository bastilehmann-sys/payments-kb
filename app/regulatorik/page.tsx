import { getRegulatorikEntries } from '@/lib/queries/entries';
import { RegulatorikGrid } from '@/components/browse/regulatorik-grid';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulatorik — Payments KB',
};

export default async function RegulatorikPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getRegulatorikEntries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Regulatorik</h1>
        <p className="text-sm text-muted-foreground">
          Regulatorische Anforderungen und Compliance-Rahmenwerke für den Zahlungsverkehr.
          Klick auf eine Zeile für Details.
        </p>
      </div>

      <RegulatorikGrid data={data} />
    </div>
  );
}
