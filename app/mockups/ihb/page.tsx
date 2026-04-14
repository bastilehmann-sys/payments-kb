import { getIhbEntries } from '@/lib/queries/entries';
import { IhbPanelMock } from './ihb-panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup — IHB/POBO/COBO Redesign',
};

export default async function IhbMockupPage() {
  const all = await getIhbEntries();
  const italy = all.find((e) => e.land?.toLowerCase() === 'italien');
  if (!italy) return <div className="p-8">Kein Italien-Eintrag gefunden.</div>;
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mockup — neuer IHB/POBO/COBO-Bereich
        </div>
        <h1 className="text-2xl font-semibold">Italien · IT · EUR</h1>
      </div>

      <div className="rounded-lg border border-amber-300/40 bg-amber-50/40 p-3 text-sm dark:border-amber-700/30 dark:bg-amber-950/20">
        <strong>Vorher/Nachher-Vergleich:</strong> Zusammenfassung, IHB-Design und SAP-Konfiguration sind raus — redundant mit Status-Badges und dem zentralen SAP-Bezug. Nur Status, Einschränkungen, Rechtsgrundlage, Handlungsempfehlung.
      </div>

      <IhbPanelMock data={italy} />
    </div>
  );
}
