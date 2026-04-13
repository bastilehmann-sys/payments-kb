import { getFormatEntries } from '@/lib/queries/entries';
import { FormateGrid } from '@/components/browse/formate-grid';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formate — Payments KB',
};

export default async function FormateePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getFormatEntries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Format-Bibliothek</h1>
        <p className="text-sm text-muted-foreground">
          Zahlungs- und Kontonachrichten-Formate: ISO 20022, SWIFT MT, und mehr.
          Klick auf eine Zeile für Details.
        </p>
      </div>

      <FormateGrid data={data} />
    </div>
  );
}
