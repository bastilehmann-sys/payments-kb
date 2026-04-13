import { getRegulatorikEntries } from '@/lib/queries/entries';
import { LinearGrid } from './linear-grid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup 1 — Dense Linear / Notion Style',
};

export default async function Mockup1Page() {
  const data = await getRegulatorikEntries();
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
              Variante 01
            </span>
            <span className="text-xs text-muted-foreground">Dense Linear / Notion Style</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Regulatorik</h1>
          <p className="text-sm text-muted-foreground">
            Kompakte Tabellenansicht · Klick auf Zeile öffnet Side-Panel · Esc oder ↑↓ für Navigation
          </p>
        </div>
        <a
          href="/mockups"
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
        >
          ← Zurück zu Mockups
        </a>
      </div>
      <LinearGrid data={data} />
    </div>
  );
}
