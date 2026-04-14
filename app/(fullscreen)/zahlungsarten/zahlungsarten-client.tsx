'use client';

import { SplitView, type Column } from '@/components/browse/split-view';
import { RelatedItemsPanel } from '@/components/browse/related-items-panel';
import type { ClearingWithLink } from '@/lib/queries/entries';

interface ZahlungsartenClientProps {
  items: Record<string, unknown>[];
  columns: Column[];
}

export function ZahlungsartenClient({ items, columns }: ZahlungsartenClientProps) {
  return (
    <SplitView
      items={items}
      columns={columns}
      primaryField="name"
      secondaryField="instrument_typ"
      searchFields={['name', 'kuerzel', 'instrument_typ', 'clearing_system', 'nachrichtenformat']}
      filterField="instrument_typ"
      filterLabel="Alle Typen"
      summaryField="beschreibung_einsteiger"
      editTable="zahlungsart_entries"
      relatedPanel={(item) => {
        const list = (item.relatedClearing as ClearingWithLink[] | undefined) ?? [];
        return (
          <RelatedItemsPanel
            title="Clearing-Systeme"
            items={list.map((c) => ({
              id: c.id,
              label: c.name,
              abkuerzung: c.abkuerzung,
              note: c.note,
              primary: c.is_primary,
            }))}
            targetPath="/clearing"
          />
        );
      }}
    />
  );
}
