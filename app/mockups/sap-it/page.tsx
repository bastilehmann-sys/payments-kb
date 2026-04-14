import { getCountryBlocks } from '@/lib/queries/documents';
import { SapItPanel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — SAP-Besonderheiten Italien',
};

export default async function Page() {
  const blocks = await getCountryBlocks('IT');
  const sap = blocks.find((b) => b.blockNo === 4);
  if (!sap) return <div className="p-8">Kein SAP-Block gefunden.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — SAP-Besonderheiten Italien
        </div>
        <h1 className="text-2xl font-semibold">Italien · SAP-Konfiguration</h1>
        <p className="mt-1 text-base text-muted-foreground">
          {sap.rows.length} Themen — gruppiert nach SAP-Bereich, mit TCODEs, Tabellen und konkreten Schritten.
        </p>
      </div>
      <SapItPanel rows={sap.rows} />
    </div>
  );
}
