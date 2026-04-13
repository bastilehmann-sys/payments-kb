'use client';

import { SplitView, type Column } from '@/components/browse/split-view';
import { FormatSampleCard } from '@/components/browse/formate-sample-card';

interface FormateClientProps {
  items: Record<string, unknown>[];
  columns: Column[];
}

export function FormateClient({ items, columns }: FormateClientProps) {
  return (
    <SplitView
      items={items}
      columns={columns}
      primaryField="format_name"
      secondaryField="nachrichtentyp"
      searchFields={['format_name', 'nachrichtentyp', 'familie_standard', 'aktuelle_version']}
      filterField="familie_standard"
      filterLabel="Alle Familien"
      summaryField="beschreibung_einsteiger"
      extraDetailHeader={(item) => (
        <FormatSampleCard formatName={String(item['format_name'] ?? '')} />
      )}
    />
  );
}
