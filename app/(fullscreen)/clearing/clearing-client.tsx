'use client';

import { SplitView, type Column } from '@/components/browse/split-view';
import { RelatedItemsPanel } from '@/components/browse/related-items-panel';
import type { ZahlungsartWithLink } from '@/lib/queries/entries';

interface ClearingClientProps {
  items: Record<string, unknown>[];
  columns: Column[];
}

export function ClearingClient({ items, columns }: ClearingClientProps) {
  return (
    <SplitView
      items={items}
      columns={columns}
      primaryField="name"
      secondaryField="region"
      searchFields={['name', 'abkuerzung', 'region', 'typ', 'betreiber']}
      filterField="region"
      filterLabel="Alle Regionen"
      headerBadgeField="abkuerzung"
      summaryField="beschreibung_einsteiger"
      editTable="clearing_entries"
      relatedPanel={(item) => {
        const list = (item.relatedZahlungsarten as ZahlungsartWithLink[] | undefined) ?? [];
        return (
          <RelatedItemsPanel
            title="Zahlungsarten über dieses System"
            items={list.map((z) => ({
              id: z.id,
              label: z.name,
              abkuerzung: z.kuerzel,
              note: z.note,
              primary: z.is_primary,
            }))}
            targetPath="/zahlungsarten"
          />
        );
      }}
    />
  );
}
