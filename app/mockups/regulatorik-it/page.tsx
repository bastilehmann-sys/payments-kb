import { getCountryBlocks } from '@/lib/queries/documents';
import { RegulatorikItPanel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — Regulatorik Italien',
};

export default async function Page() {
  const blocks = await getCountryBlocks('IT');
  const reg = blocks.find((b) => b.blockNo === 2);
  if (!reg) return <div className="p-8">Kein Regulatorik-Block gefunden.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — neuer Regulatorik-Tab
        </div>
        <h1 className="text-2xl font-semibold">Italien · Regulatorik</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reg.rows.length} Regelungen — strukturiert mit Quick-Facts, Drill-Down und verlinkten Quellen.
        </p>
      </div>
      <RegulatorikItPanel rows={reg.rows} />
    </div>
  );
}
