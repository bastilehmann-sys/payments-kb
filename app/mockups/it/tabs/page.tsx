import { getCountryBlocks } from '@/lib/queries/documents';
import { TabsView } from './tabs-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockup IT·A — Tab-Blöcke Einsteiger-First',
};

export default async function MockupItTabsPage() {
  const blocks = await getCountryBlocks('IT');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-600">
              Variante A
            </span>
            <span className="text-xs text-muted-foreground">Tab-Blöcke · Einsteiger-First</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            <span className="mr-2 text-muted-foreground">🇮🇹</span>Italien — Country Detail
          </h1>
          <p className="text-sm text-muted-foreground">
            Tab pro Block · Einsteiger-Ansicht zuerst · Details klappen auf
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

      {/* Tabs client component */}
      <TabsView blocks={blocks} />
    </div>
  );
}
