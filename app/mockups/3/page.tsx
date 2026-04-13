import { getRegulatorikEntries } from '@/lib/queries/entries';
import { SplitView } from './split-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup 3 — Split Master-Detail',
};

export default async function Mockup3Page() {
  const data = await getRegulatorikEntries();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#b47aff]/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#b47aff]">
              Variante 03
            </span>
            <span className="text-xs text-muted-foreground">Split Master-Detail</span>
          </div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Regulatorik</h1>
          <p className="text-base text-muted-foreground">
            Links: Liste · Rechts: vollständiges Detail · Klick aktualisiert Detailansicht
          </p>
        </div>
        <a
          href="/mockups"
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
        >
          ← Zurück zu Mockups
        </a>
      </div>
      <SplitView data={data} />
    </div>
  );
}
