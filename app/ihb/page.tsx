import { getIhbEntries } from '@/lib/queries/entries';
import { IhbGrid } from '@/components/browse/ihb-grid';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IHB / POBO — Payments KB',
};

export default async function IhbPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getIhbEntries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">IHB / POBO / COBO</h1>
        <p className="text-sm text-muted-foreground">
          In-House Banking, Payment-on-Behalf-of und Collection-on-Behalf-of — Fähigkeit pro Land.
          Klick auf eine Zeile für Details.
        </p>
      </div>

      <IhbGrid data={data} />
    </div>
  );
}
