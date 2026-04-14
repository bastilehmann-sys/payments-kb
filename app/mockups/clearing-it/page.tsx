import { getCountryBlocks } from '@/lib/queries/documents';
import { ClearingItPanel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — Clearing-Systeme & lokale Banken Italien',
};

export default async function Page() {
  const blocks = await getCountryBlocks('IT');
  const cl = blocks.find((b) => b.blockNo === 3);
  if (!cl) return <div className="p-8">Kein Clearing-Block gefunden.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — Clearing-Systeme & lokale Banken
        </div>
        <h1 className="text-2xl font-semibold">Italien · Clearing & Banken</h1>
        <p className="mt-1 text-base text-muted-foreground">
          {cl.rows.length} Einträge — gruppiert in Clearing-Systeme · Standards & lokale Instrumente · Hauptbanken.
        </p>
      </div>
      <ClearingItPanel rows={cl.rows} />
    </div>
  );
}
