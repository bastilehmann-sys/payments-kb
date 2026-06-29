import { getFormatEntries, getFormatVersions } from '@/lib/queries/entries';
import { Pain001V09Panel } from './panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — pain.001.001.09 Detail',
};

export default async function Page() {
  const [allEntries, versions] = await Promise.all([
    getFormatEntries(),
    getFormatVersions(),
  ]);
  const base = allEntries.find((e) => e.format_name === 'pain.001');
  const version = versions.find((v) => v.format_name === 'pain.001' && v.version === '001.001.09');
  const allPain001 = versions.filter((v) => v.format_name === 'pain.001').sort((a, b) => a.version.localeCompare(b.version));

  if (!base || !version) return <div className="p-8">pain.001.001.09 nicht gefunden.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — Versions-Detail-Seite (Beispiel pain.001.001.09)
        </div>
        <h1 className="text-2xl font-semibold">pain.001.001.09</h1>
      </div>
      <Pain001V09Panel
        base={base as unknown as Record<string, string | null>}
        version={version as unknown as Record<string, string | null | boolean>}
        allVersions={allPain001 as unknown as Array<Record<string, string | null | boolean>>}
      />
    </div>
  );
}
