import { getCountryBlocks } from '@/lib/queries/documents';
import { QAView } from './qa-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup IT·C — FAQ-Stil Fragen/Antworten',
};

export default async function MockupItQAPage() {
  const blocks = await getCountryBlocks('IT');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-violet-600">
              Variante C
            </span>
            <span className="text-xs text-muted-foreground">FAQ-Stil · Fragen/Antworten</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            <span className="mr-2 text-muted-foreground">🇮🇹</span>Italien — Country Detail
          </h1>
          <p className="text-sm text-muted-foreground">
            Suche über alle Felder · Tag-Filter nach Block · Accordion für Experten-Ansicht
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/mockups/it"
            className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            ← IT Mockups
          </a>
        </div>
      </div>

      {/* QA client component */}
      <QAView blocks={blocks} />
    </div>
  );
}
