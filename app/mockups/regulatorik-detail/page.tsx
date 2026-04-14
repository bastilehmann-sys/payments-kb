import { getRegulatorikEntries } from '@/lib/queries/entries';
import { RegulatorikDetailPanel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — Regulatorik Detail',
};

export default async function Page() {
  const all = await getRegulatorikEntries();
  // DORA als exemplarischer Eintrag
  const entry = all.find((e) => e.kuerzel === 'DORA') ?? all[0];
  if (!entry) return <div className="p-8">Keine Einträge.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — Regulatorik Detail (3 Tabs statt 9)
        </div>
        <h1 className="text-2xl font-semibold">Beispiel: {entry.kuerzel}</h1>
        <p className="mt-1 text-base text-muted-foreground">
          {entry.name}
        </p>
      </div>
      <RegulatorikDetailPanel entry={entry as unknown as Record<string, string | null>} />
    </div>
  );
}
