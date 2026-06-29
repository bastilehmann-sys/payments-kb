import { getFormatEntries } from '@/lib/queries/entries';
import { FormateDetailPanel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — Format Detail',
};

export default async function Page() {
  const all = await getFormatEntries();
  const entry = all.find((e) => /pain\.001/.test(e.format_name)) ?? all[0];
  if (!entry) return <div className="p-8">Keine Einträge.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — Format Detail (3 Tabs, SAP permanent)
        </div>
        <h1 className="text-2xl font-semibold">Beispiel: {entry.format_name}</h1>
      </div>
      <FormateDetailPanel entry={entry as unknown as Record<string, string | null>} />
    </div>
  );
}
