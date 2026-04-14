import { getCountryBlocks } from '@/lib/queries/documents';
import { FormateItPanel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — Lokale Zahlungsformate Italien',
};

export default async function Page() {
  const blocks = await getCountryBlocks('IT');
  const lf = blocks.find((b) => b.blockNo === 5);
  if (!lf) return <div className="p-8">Kein Block gefunden.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — Lokale Zahlungsformate & Instrumente
        </div>
        <h1 className="text-2xl font-semibold">Italien · Formate</h1>
        <p className="mt-1 text-base text-muted-foreground">
          {lf.rows.length} Felder — gegliedert in Format-Sektionen mit drill-down.
        </p>
      </div>
      <FormateItPanel rows={lf.rows} />
    </div>
  );
}
